const permissionInfo = {};

export const getPermission = (path) => {
  const USER = JSON.parse(localStorage.getItem('user'));
  const PERMISSIONS = USER.roleId?.permissions;
  PERMISSIONS.forEach((permission) => {
    permissionInfo[permission.path] = {
      read: permission?.read,
      delete: permission?.delete,
      update: permission?.update
    };
  });
  return permissionInfo[path];
};
