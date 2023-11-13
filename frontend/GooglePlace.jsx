import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { Text, Button, ButtonGroup } from "@shopify/polaris";

const GooglePlace = ({email, handleSearchBusinessClick}) => {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed', error),
        isSignedIn: true,
        accessType: "offline",
        // scope: "profile email auth/business.manage",
        // scope: "https://www.googleapis.com/auth/gmail.readonly",
        scope: "profile email",
        responseType: "code",
        prompt: "consent",
        flow: 'implicit'
    });

    useEffect(
        () => {
            if (user) {
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    console.log('profile', res.data)
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
            }
        },
        [user]
    );

    const logout = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <>
            <Text as="p">
                You have signed in with {email} account.
            </Text>
            <ButtonGroup>
                <Button onClick={login}>Sign in with another Google account</Button>
                <Button onClick={logout}>Sign out</Button>
            </ButtonGroup>
            <Text as="p" tone="caution">
                Please, select your business below. Alternatively, you can&nbsp;
                <Button
                    variant="plain"
                    onClick={handleSearchBusinessClick}
                >
                    search your business
                </Button>
                &nbsp;by name and address.
            </Text>
        </>
    );
}

export default GooglePlace;