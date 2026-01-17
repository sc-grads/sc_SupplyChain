import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        // Static credentials
        const users = {
            'supplier@easystock.com': {
                password: 'supplier123',
                type: 'supplier',
                name: 'Supplier User',
                email: 'supplier@easystock.com',
            },
            'business@easystock.com': {
                password: 'business123',
                type: 'small-business',
                name: 'Small Business User',
                email: 'business@easystock.com',
            },
        };

        const foundUser = users[email];

        if (foundUser && foundUser.password === password) {
            const { password: _, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            return { success: true, user: userWithoutPassword };
        }

        return { success: false, error: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Check for existing session on mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
