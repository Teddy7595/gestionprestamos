
export const rolesMenu = {
  sessionBaseUrl: "dashboard",
  GENERAL: [
    {
      name: "Perfil",
      icon: null,
      url: "profile",
    },

    {
      name: "Notificaciones",
      icon: null,
      url: "notifications",
      child: [
        {
          name: "Notificación",
          icon: null,
          url: "notification/:id",
        },
      ],
    },
    {
      name: "Configuraciones",
      icon: null,
      url: "settings",
    },
    {
      name: "Cerrar sesión",
      icon: null,
      url: null,
    },
  ],

  ADMIN_ROLE: [
    {
      name: "Gestión de usuarios",
      icon: null,
      url: "usersControl",
      child: [
          {
            name: "Información de usuario",
          icon: null,
           url: "user/:id"
        }
        ],
    },
    {
      name: "Gestión de rutas",
      icon: null,
      url: "routesControl",
      child: [
        {
          name: "Información de ruta",
        icon: null,
         url: "route/:id"
      }
      ],
    },
    {
      name: "Estadísticas generales",
      icon: null,
      url: "chartsControl"

    },
    {
      name: "Control de roles",
      icon: null,
      url: "rolesControl",
    },

  ],

  DEFAULT_ROLE: [
    {
      name: "Solicitar licencia",
      icon: null,
      url: "licenseRequest",
    },
  ],
  ENRUTATOR_ROLE: [
    {
      name: "Mis rutas",
      icon: null,
      url: "myRoutes",
      child: [
        {
          name: "Información de ruta",
        icon: null,
         url: "myRoute/:id"
      }
      ],
    },
  ],
  COLLECTOR_ROLE: [
    {
      name: "Mis rutas",
      icon: null,
      url: "myRoutes",
      child: [
        {
          name: "Información de ruta",
        icon: null,
         url: "myRoute/:id"
      }
      ],
    },
  ],
};




// DEFAULT_ROLE
// ADMIN_ROLE
// ENRUTATOR_ROLE
// COLLECTOR_ROLE
