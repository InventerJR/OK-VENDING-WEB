

type User = {
    name: string;
    address: string;
    phone: string;
    email: string;
    type: string;
}

enum UserType {
    SUPER_ADMIN = 0,
    ADMIN = 1,
    OPERATOR = 5,
}

export default User;