import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        const users = JSON.parse(
            localStorage.getItem("artisanHubUsers") || "[]"
        );

        const user = users.find(
            (item) =>
                item.email === email &&
                item.password === password
        );

        if (!user) {
            setError("Invalid email or password.");
            return;
        }

        const loggedInUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        localStorage.setItem(
            "artisanHubCurrentUser",
            JSON.stringify(loggedInUser)
        );

        if (rememberMe) {
            localStorage.setItem(
                "artisanHubRememberMe",
                "true"
            );
        }

        alert(`Welcome back, ${user.name}!`);

        if (user.role === "artisan") {
            navigate("/artisan/dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <p>WELCOME BACK</p>

                    <h1>Login</h1>

                    <span>
                        Sign in to continue your ArtisanHub journey.
                    </span>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <label>
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                    />

                    <label>
                        Password
                    </label>

                    <div className="password-wrapper">
                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword
                                ? "Hide"
                                : "Show"}
                        </button>
                    </div>

                    <div className="remember-row">
                        <label>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                            />

                            Remember me
                        </label>

                        <span>
                            Forgot password?
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?

                    <Link to="/register">
                        Create Account
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default Login;