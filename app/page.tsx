import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

const Home = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    <main>
      <h1>Hello Blog 101</h1>
      {user ? (
        <LogoutLink>
          <Button>Logout</Button>
        </LogoutLink>
      ) : (
        <div>
          <LoginLink>
            <Button>Sign in</Button>
          </LoginLink>
          <RegisterLink>
            <Button>Sign up</Button>
          </RegisterLink>
        </div>
      )}
    </main>
  );
};

export default Home;
