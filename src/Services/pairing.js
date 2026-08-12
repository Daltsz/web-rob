import {api} from './http'


export async function pairRobot(robotCode) {
    const response = await api.post('/users/pair', {robotCode});    
    return response.data
}

export async function getMyRobots(){
    const response = await api.get('/users/me');
    return response.data.robots || [];
}

