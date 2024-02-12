import { useEffect } from 'react';

export const useUpdateBodyClass = (pathname) => {
    useEffect(() => {
        switch (pathname) {
            case '/':
                document.body.className = 'greenpage';
                document.body.className = 'frontpage';
                break;
            case '/about':
            case '/completeprofile':
                document.body.className = 'greenpage';
                break;
            case '/overview':
            case '/household':
                document.body.className = 'bluepage';
                break;
            case '/dashboard':
                document.body.className = 'yellowpage';
                break;
            default:
                document.body.className = '';
        }
    }, [pathname]);
};

