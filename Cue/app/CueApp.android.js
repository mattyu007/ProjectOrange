// @flow

export default function startApp(isLoggedIn: boolean) {
  if (isLoggedIn) {
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Library',
          screen: CueScreens.libraryHome,
          icon: CueIcons.tabLibrary,
          selectedIcon: CueIcons.tabLibrarySelected,
          title: 'Library', // TODO: Remove
        },
        {
          label: 'Discover',
          screen: CueScreens.discoverHome,
          icon: CueIcons.tabDiscover,
          selectedIcon: CueIcons.tabDiscoverSelected,
          title: 'Discover', // TODO: Remove
        },
        {
          label: 'Search',
          screen: CueScreens.searchHome,
          icon: CueIcons.tabSearch,
          selectedIcon: CueIcons.tabSearchSelected,
          title: 'Search', // TODO: Remove
        },
        {
          label: 'Account',
          screen: CueScreens.accountHome,
          icon: CueIcons.tabAccount,
          selectedIcon: CueIcons.tabAccountSelected,
          title: 'Account', // TODO: Remove
        },
      ],
      tabsStyle: {
        tabBarSelectedButtonColor: CueColors.primaryTint,
      },
      appStyle: {
        navBarTextColor: CueColors.toolbarText,
        navBarBackgroundColor: CueColors.primaryTint,
        navBarButtonColor: CueColors.toolbarText,

        // iOS:
        statusBarTextColorScheme: 'light',
      }
    })
  } else {
    Navigation.startSingleScreenApp({
      screen: {
        screen: CueScreens.loginScreen,
        title: 'Login', // TODO: remove
      }
    })
  }
}
