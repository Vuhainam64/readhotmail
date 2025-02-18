export const setTokens = (accessToken, refreshToken, accountId) => ({
    type: 'SET_TOKENS',
    payload: {
        accessToken,
        refreshToken,
        accountId,
    },
});

export const setUserRole = (role) => ({
    type: 'SET_USER_ROLE',
    payload: role,
});

export const logout = () => ({
    type: 'LOGOUT',
});

