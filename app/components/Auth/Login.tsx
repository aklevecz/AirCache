import Button from "../Button";

export default function Login({ login, logout }: any) {
  return (
    <div>
      <Button className="w-32" onClick={login}>
        Login
      </Button>
      <Button className="w-32" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
