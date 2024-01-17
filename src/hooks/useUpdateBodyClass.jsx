import { useEffect } from 'react';

export const useUpdateBodyClass = (pathname) => {
    useEffect(() => {
        if (pathname === '/') {
            document.body.className = 'greenpage';
        } else if (pathname === '/about' || pathname === '/completeprofile') {
            document.body.className = 'greenpage';
        } else if (pathname === '/overview' || pathname === '/household') {
            document.body.className = 'bluepage';
        } else if (pathname === '/dashboard') {
            document.body.className = 'yellowpage';
        } else {
            document.body.className = '';
        }
    }, [pathname]);
};

