import React from 'react';
import './loginPage.css';
function LoginPage() {
  return (
    <div>  
    <h1>WELCOME</h1>
    <br></br>
    <div>
        <form>
      <label htmlFor="username">Username: </label>   
      <input className="form-input" type="text" id="username" name="username" required />
      <br></br>
      <br></br>
      <label htmlFor="password">Password: </label>
      <input className="form-input" type="password" id="password" name="password" required />
      <br></br>
      <button className="submit-btn" type="submit">Login</button>
      <br> </br>
            <p className='forgot-password'><a href="/forgot-password">Forgot Password?</a></p>
<br></br>
      <p >Don't have an account? <a href="/signup">Sign up</a></p>  
      <p>______________________________________</p>
      <button className="submit-btn" type="submit">Login with Google</button>
      <br></br>
      <button className="submit-btn" type="submit">Login with Facebook</button>
    </form>
    </div>
    
  </div>
);
}

export default LoginPage;