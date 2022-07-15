import AxiosClient from "./axiosClient"

const UserAPI = {
    getAllUser(role, sort, limit, offset){
        const url = `/user?role=${role}&limit=${limit}&offset=${offset}&sort=${sort}`;
        return AxiosClient.get(url)
    },

    getUserInfo(userId){
        const url = `/user/${userId}`;
        return AxiosClient.get(url)
    },

    updateUserInfo({id, email, name, address, phone_number}) {
        const url = `/user/${id}`;
        return AxiosClient.post(url, {email, name, address, phone_number} )
    },

    deleteUser(userId, role) {
        const url = `/user/${userId}?role=${role}`;
        return AxiosClient.delete(url)
    },

    changeUserStatus(status, userId, role) {
        const url = `/user/status/${userId}?role=${role}&status=${status}`;
        return AxiosClient.put(url)
    },

    updateUserName(first_name, last_name, userId) {
        const url = `/user/${userId}/name`
        return AxiosClient.put(url, {first_name, last_name})
    },

    updateUserAvatar(userId, imageUrl) {
        const url = `/user/${userId}/avatar`
        return AxiosClient.put(url, {avatar: imageUrl})
    }
};
export default UserAPI;
