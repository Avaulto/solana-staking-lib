import React, { FC } from 'react';

// Use require instead of import, and order matters
// require('./notification.css');

export interface NotificationProps {
    message: string;
    variant: 'error' | 'info' | 'success';
    fn?: Function
}

export const Notification: FC<NotificationProps> = ({ message, variant,fn }) => {
    const triggerFn = (fn: Function | any) =>{
        if(fn){
            fn()
        }
    }
    return <div onClick={ () => triggerFn(fn)} className={`wallet-notification wallet-notification-${variant}`}>{message}</div>;
};