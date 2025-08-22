enum UserRoleEnum {
  ADMIN = 'ADMIN',
  RESELLER = 'RESELLER',
}

const GetUserRoleEnumList = () => {
  return [
    {
      label: 'Administrador',
      value: UserRoleEnum.ADMIN,
    },
    {
      label: 'Revendedor',
      value: UserRoleEnum.RESELLER,
    },
  ];
};

export { UserRoleEnum, GetUserRoleEnumList };
