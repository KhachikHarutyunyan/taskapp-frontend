let logoutListeners = [];

export const subscribeLogout = (cb) => {
    logoutListeners.push(cb);
};

export const triggerLogout = () => {
    logoutListeners.forEach(cb => cb());
};