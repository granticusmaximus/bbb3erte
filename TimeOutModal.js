import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import Modal from '@components/Modal';
 
export default function TimeoutModal ({ onContinueWorking, onLogout }) {
    const [timeRemaining, setTimeRemaining] = useState(60);
 
    useEffect(() => {
        let sessionCountdown = null;
        sessionCountdown = setTimeout(() => {
            if (timeRemaining === 0) {
                onLogout();
            }
            else {
                setTimeRemaining(timeRemaining - 1);
            }
        }, 1800);
        return () => {
            clearTimeout(sessionCountdown);
        }
    }, [timeRemaining, onLogout]);
 
    return (
        <Modal
            size="tiny"
            open={true}
        >
            <Modal.Header>Session Expiring</Modal.Header>
            <Modal.Content>
                <p>Your session will expired in <em>{timeRemaining}</em> seconds due to inactivity. Would you like to continue working?</p>
            </Modal.Content>
            <Modal.Actions>
                <Button primary onClick={onContinueWorking}>
                    Continue Working
                </Button>
                <Button
                    color="grey"
                    onClick={() => {
                        onLogout();
                        }
                    }
                >
                Logout
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
