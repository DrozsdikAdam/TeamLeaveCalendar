import userService from "../services/user.service.js";

class UserController {
    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (err) {
            console.error('Hiba a UserController-ben:', err.message);
            return res.status(500).json({ error: 'Nem sikerült lekérni a csapattagokat.' });
        }
    }
}

export default new UserController();