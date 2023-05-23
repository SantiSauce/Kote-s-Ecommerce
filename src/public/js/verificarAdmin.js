export let verificarAdmin = (req) => {
    let activeSession;
    let admin;
    const user = req.session?.user
    if (req.session?.user) {
      activeSession = true;
    } else { 
      activeSession = false;
      admin = null
      return{activeSession, admin}
    }
    if (req.session.user.rol == "admin") {
      admin = true;
    } else {
      admin = false;
    }
    return {activeSession, admin};
};