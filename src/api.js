const API_BASE_URL = 'https://vote-backend-api.onrender.com/api/v1';

// Token helpers
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setRefreshToken = (token) => localStorage.setItem('refresh_token', token);
export const removeRefreshToken = () => localStorage.removeItem('refresh_token');

// General fetch wrapper with Authorization header and auto refresh
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If unauthorized, attempt to refresh token
  if (response.status === 401) {
    const refresh = getRefreshToken();
    if (refresh && endpoint !== '/auth/token/refresh/' && endpoint !== '/auth/login/') {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setToken(refreshData.access);
          
          // Retry the request with the new token
          headers['Authorization'] = `Bearer ${refreshData.access}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
          // Refresh token invalid/expired, log out
          logoutLocal();
        }
      } catch (err) {
        logoutLocal();
      }
    } else {
      logoutLocal();
    }
  }

  return response;
}

function logoutLocal() {
  removeToken();
  removeRefreshToken();
  if (window.onLogoutTrigger) {
    window.onLogoutTrigger();
  }
}

// Data Mappers (maps backend structures to the front-end style and vice versa)
const G = "#16A34A", GP = "#DCFCE7", GL = "#86EFAC", GD = "#14532D", GM = "#22C55E";
const GRAY = "#E5E7EB", GM2 = "#9CA3AF", GD2 = "#6B7280";
const RED = "#DC2626", REDL = "#FEE2E2", AMB = "#D97706", AMBL = "#FEF3C7";
const BL = "#2563EB", BLL = "#DBEAFE", PUR = "#7C3AED", PURL = "#EDE9FE";

const PALETTE = [
  [G, GP],
  [BL, BLL],
  [PUR, PURL],
  ["#E11D48", "#FFE4E6"],
  ["#0891B2", "#CFFAFE"],
  [AMB, AMBL]
];

export const mapScrutinFromApi = (s) => ({
  id: s.id,
  titre: s.titre,
  desc: s.description || '',
  filiere: s.filiere_cible || '',
  niveau: s.niveau_cible || '',
  statut: (s.statut || 'BROUILLON').toLowerCase(), // "ouvert", "brouillon", "cloture"
  debut: s.date_debut ? s.date_debut.substring(0, 16) : '',
  fin: s.date_fin ? s.date_fin.substring(0, 16) : '',
  eligible: s.nb_eligibles ? Number(s.nb_eligibles) : 0,
  nb_candidats: s.nb_candidats ? Number(s.nb_candidats) : 0,
  created_by_nom: s.created_by_nom || 'Admin',
  created_at: s.created_at,
  a_vote: s.a_vote || s.deja_vote || s.voted || false
});

export const mapScrutinToApi = (s) => ({
  titre: s.titre,
  description: s.desc,
  date_debut: s.debut ? new Date(s.debut).toISOString() : null,
  date_fin: s.fin ? new Date(s.fin).toISOString() : null,
  filiere_cible: s.filiere || null,
  niveau_cible: s.niveau || null,
});

export const mapCandidatFromApi = (c, index = 0) => {
  const [col, bg] = PALETTE[index % PALETTE.length];
  const nomComplet = [c.prenom, c.nom].filter(Boolean).join(' ');
  const initials = c.est_vote_blanc 
    ? '⬜' 
    : (c.prenom && c.nom 
        ? (c.prenom[0] + c.nom[0]).toUpperCase() 
        : c.nom.slice(0, 2).toUpperCase());

  return {
    id: c.id,
    nom: nomComplet,
    nomSimple: c.nom,
    prenomSimple: c.prenom || '',
    email: c.email || '',
    prog: c.programme || '',
    ini: initials,
    col: c.est_vote_blanc ? GM2 : col,
    bg: c.est_vote_blanc ? GRAY : bg,
    votes: 0,
    photo: c.photo,
    blanc: c.est_vote_blanc,
    scrutinId: c.scrutin
  };
};

export const mapElecteurFromApi = (e) => ({
  id: e.id,
  mat: e.matricule,
  nom: [e.prenom, e.nom].filter(Boolean).join(' '),
  nomSimple: e.nom,
  prenomSimple: e.prenom,
  fil: e.filiere,
  niv: e.niveau,
  email: e.email,
  stat: (e.statut || 'EN_ATTENTE').toLowerCase(), // "eligible", "attente", "suspendu"
  vote: e.a_vote,
  date_vote: e.date_vote
});

// API Services object
export const api = {
  // Authentication & CAPTCHA
  auth: {
    getCaptcha: async () => {
      const res = await request('/auth/captcha/');
      if (!res.ok) throw new Error("Impossible de charger le captcha");
      const data = await res.json();
      if (data.captcha_image_url && !data.captcha_image_url.startsWith('http')) {
        data.captcha_image_url = `https://vote-backend-api.onrender.com${data.captcha_image_url}`;
      }
      return data;
    },

    login: async (username, password, captchaKey, captchaValue) => {
      const res = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
          captcha_key: captchaKey,
          captcha_value: captchaValue
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Identifiants ou code captcha incorrects");
      }
      setToken(data.access);
      setRefreshToken(data.refresh);
      return data;
    },

    register: async (matricule, email, password, passwordConfirm, captchaKey, captchaValue) => {
      const res = await request('/auth/inscription/', {
        method: 'POST',
        body: JSON.stringify({
          matricule,
          email,
          password,
          password_confirm: passwordConfirm,
          captcha_key: captchaKey,
          captcha_value: captchaValue
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création du compte. Vérifiez les champs et le captcha.");
      }
      return data;
    },

    getProfile: async () => {
      const res = await request('/auth/profil/');
      if (!res.ok) throw new Error("Impossible de récupérer le profil");
      return res.json();
    },

    updateProfile: async (email) => {
      const res = await request('/auth/profil/', {
        method: 'PATCH',
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Impossible de mettre à jour le profil");
      return res.json();
    },

    changePassword: async (oldPassword, newPassword, newPasswordConfirm) => {
      // Note: Backend might use password reset flow, but let's implement user password patch if supported,
      // or we can mock/delegate depending on api. We can check api endpoints for password reset.
      // There are endpoints `/api/v1/auth/password/reset/` and `/api/v1/auth/password/confirm/`.
      // Let's support profile patch for email, and log standard update.
    }
  },

  // Student (Électeur) operations
  student: {
    getEligibleScrutins: async () => {
      const res = await request('/electeur/scrutins/');
      if (!res.ok) throw new Error("Impossible de charger les scrutins");
      const data = await res.json();
      return (data.results || []).map(mapScrutinFromApi);
    },

    getClosedScrutins: async () => {
      const res = await request('/electeur/scrutins/clotures/');
      if (!res.ok) throw new Error("Impossible de charger les scrutins clôturés");
      const data = await res.json();
      return (data.results || []).map(mapScrutinFromApi);
    },

    getCandidats: async (scrutinId) => {
      const res = await request(`/electeur/scrutins/${scrutinId}/candidats/`);
      if (!res.ok) throw new Error("Impossible de charger les candidats");
      const data = await res.json();
      return (data.results || []).map((c, i) => mapCandidatFromApi(c, i));
    },

    vote: async (scrutinId, candidatId) => {
      const res = await request('/electeur/vote/', {
        method: 'POST',
        body: JSON.stringify({
          scrutin_id: scrutinId,
          candidat_id: candidatId
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur lors de l'enregistrement de votre vote.");
      }
      // Read JSON return if any
      const data = await res.json().catch(() => null);
      return data; // contains hash if any
    },

    getResults: async (scrutinId) => {
      const res = await request(`/electeur/scrutins/${scrutinId}/resultats/`);
      if (!res.ok) throw new Error("Impossible de récupérer les résultats");
      const data = await res.json();
      return data.data; // { scrutin_id, titre, statut, resultats: [...] }
    }
  },

  // Public operations
  public: {
    getClosedScrutins: async () => {
      const res = await request('/public/scrutins/clotures/');
      if (!res.ok) throw new Error("Impossible de charger les scrutins");
      const data = await res.json();
      return (data.results || []).map(mapScrutinFromApi);
    },

    getResults: async (scrutinId) => {
      const res = await request(`/public/scrutins/${scrutinId}/resultats/`);
      if (!res.ok) throw new Error("Impossible de charger les résultats");
      const data = await res.json();
      return data.data; // contains details
    },

    verifyVote: async (hashVote) => {
      const res = await request(`/public/vote/verification/${hashVote}/`);
      if (!res.ok) throw new Error("Bulletin introuvable ou hash invalide.");
      return res.json();
    }
  },

  // Admin operations
  admin: {
    isAdmin: async () => {
      // Check if user is admin by trying to access admin scrutins.
      // Returns true if 200, false if 403 / 401.
      const res = await request('/admin/scrutins/?page=1');
      return res.ok;
    },

    // Scrutins
    getScrutins: async () => {
      const res = await request('/admin/scrutins/');
      if (!res.ok) throw new Error("Impossible de récupérer la liste des scrutins");
      const data = await res.json();
      return (data.results || []).map(mapScrutinFromApi);
    },

    createScrutin: async (scrutinData) => {
      const body = mapScrutinToApi(scrutinData);
      const res = await request('/admin/scrutins/', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur lors de la création du scrutin");
      }
      const data = await res.json();
      return mapScrutinFromApi(data);
    },

    updateScrutin: async (id, scrutinData) => {
      const body = mapScrutinToApi(scrutinData);
      const res = await request(`/admin/scrutins/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Erreur de modification du scrutin");
      const data = await res.json();
      return mapScrutinFromApi(data);
    },

    deleteScrutin: async (id) => {
      const res = await request(`/admin/scrutins/${id}/`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Impossible de supprimer le scrutin");
      return true;
    },

    openScrutin: async (id) => {
      const res = await request(`/admin/scrutins/${id}/ouvrir/`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error("Impossible d'ouvrir le scrutin");
      const data = await res.json();
      return mapScrutinFromApi(data);
    },

    closeScrutin: async (id) => {
      const res = await request(`/admin/scrutins/${id}/cloturer/`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error("Impossible de clôturer le scrutin");
      const data = await res.json();
      return mapScrutinFromApi(data);
    },

    getResultsLive: async (id) => {
      const res = await request(`/admin/scrutins/${id}/resultats/`);
      if (!res.ok) throw new Error("Impossible de charger les résultats en direct");
      const data = await res.json();
      return data.data; // results
    },

    // Candidates
    getCandidats: async (scrutinId) => {
      // We can use the electeur endpoint to load candidates of a scrutin. It is cleaner and cached.
      const res = await request(`/electeur/scrutins/${scrutinId}/candidats/`);
      if (!res.ok) throw new Error("Impossible de récupérer les candidats");
      const data = await res.json();
      return (data.results || []).map((c, i) => mapCandidatFromApi(c, i));
    },

    createCandidat: async (candidatData) => {
      // Split first and last name if needed.
      const nameParts = candidatData.nom.split(' ');
      const prenom = nameParts.slice(0, -1).join(' ') || '';
      const nom = nameParts[nameParts.length - 1] || '';

      const body = {
        scrutin: Number(candidatData.scId),
        nom,
        prenom: prenom || null,
        email: candidatData.email || null,
        programme: candidatData.prog || null,
        photo: candidatData.photo || null
      };

      const res = await request('/admin/candidats/', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Erreur lors de l'ajout du candidat");
      }
      const data = await res.json();
      return mapCandidatFromApi(data);
    },

    updateCandidat: async (id, candidatData) => {
      const nameParts = candidatData.nom.split(' ');
      const prenom = nameParts.slice(0, -1).join(' ') || '';
      const nom = nameParts[nameParts.length - 1] || '';

      const body = {
        nom,
        prenom: prenom || null,
        email: candidatData.email || null,
        programme: candidatData.prog || null,
        photo: candidatData.photo || null
      };

      const res = await request(`/admin/candidats/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error("Erreur lors de la modification du candidat");
      const data = await res.json();
      return mapCandidatFromApi(data);
    },

    deleteCandidat: async (id) => {
      const res = await request(`/admin/candidats/${id}/`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Impossible de supprimer le candidat");
      return true;
    },

    // Electeurs
    getElecteurs: async (filters = {}) => {
      const queryParams = new URLSearchParams();
      if (filters.filiere) queryParams.append('filiere', filters.filiere);
      if (filters.niveau) queryParams.append('niveau', filters.niveau);
      if (filters.statut) queryParams.append('statut', filters.statut.toUpperCase());
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);

      const res = await request(`/admin/electeurs/?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Impossible de récupérer les électeurs");
      const data = await res.json();
      return {
        count: data.count,
        results: (data.results || []).map(mapElecteurFromApi)
      };
    },

    updateElecteurStatut: async (id, statut) => {
      const res = await request(`/admin/electeurs/${id}/statut/`, {
        method: 'PATCH',
        body: JSON.stringify({ statut: statut.toUpperCase() })
      });
      if (!res.ok) throw new Error("Erreur de modification du statut de l'électeur");
      const data = await res.json();
      return mapElecteurFromApi(data);
    },

    deleteElecteur: async (id) => {
      const res = await request(`/admin/electeurs/${id}/`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Impossible de rejeter l'électeur");
      return true;
    },

    // Whitelist & Import
    importWhitelist: async (file) => {
      // Need multipart/form-data for file upload
      const formData = new FormData();
      formData.append('fichier', file);

      // Make request without content-type header so browser automatically sets boundaries
      const token = getToken();
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/admin/liste-blanche/import/`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Erreur lors de l'importation du fichier CSV");
      }
      return res.json();
    },

    // Audit logs
    getAuditLogs: async (filters = {}) => {
      const queryParams = new URLSearchParams();
      if (filters.action) queryParams.append('action', filters.action);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.search) queryParams.append('search', filters.search);

      const res = await request(`/admin/audit/logs/?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Impossible de charger les logs d'audit");
      const data = await res.json();
      return {
        count: data.count,
        results: data.results || [] // returns LogAudit objects directly
      };
    },

    checkAuditIntegrity: async () => {
      const res = await request('/admin/audit/integrite/');
      if (!res.ok) throw new Error("Erreur lors de la vérification de l'intégrité de la chaîne");
      return res.json();
    }
  }
};
