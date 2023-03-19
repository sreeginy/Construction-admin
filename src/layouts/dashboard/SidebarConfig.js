// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Library',
    path: '/dashboard/app',
    icon: getIcon('fluent:library-28-filled')
  },
  {
    title: 'Pitch Tracker',
    path: '/dashboard/pitchTracker',
    icon: getIcon('ant-design:fund-projection-screen-outlined')
  },
  {
    title: 'Outbounds',
    path: '/dashboard/Outbounds/',
    icon: getIcon('eva:shopping-bag-fill')
    // children: [
    //   {
    //     title: 'Movies',
    //     path: '/dashboard/productsss/',
    //     icon: getIcon('fluent:library-28-filled')
    //   },
    //   {
    //     title: 'Seasons',
    //     path: '/dashboard/productsss/',
    //     icon: getIcon('fluent:library-28-filled')
    //   }
    // ]
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: getIcon('clarity:settings-solid'),
    children: [
      {
        title: 'User',
        path: '/dashboard/settings/user',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Role',
        path: '/dashboard/settings/role',
        icon: getIcon('fluent:library-28-filled')
      }
    ]
  },
  {
    title: 'Others',
    path: '/dashboard/others',
    icon: getIcon('fluent:more-circle-32-filled'),
    children: [
      {
        title: 'Language',
        path: '/dashboard/others/language',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Platform',
        path: '/dashboard/others/platform',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Genre',
        path: '/dashboard/others/genre',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Territory',
        path: '/dashboard/others/territory',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Ratings',
        path: '/dashboard/others/ratings',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Format',
        path: '/dashboard/others/format',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Studio',
        path: '/dashboard/others/studio',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Country',
        path: '/dashboard/others/country',
        icon: getIcon('fluent:library-28-filled')
      },
      {
        title: 'Rights',
        path: '/dashboard/others/rights',
        icon: getIcon('fluent:library-28-filled')
      }
    ]
  }
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill')
  // }
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill')
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill')
  // }
];

export default sidebarConfig;
