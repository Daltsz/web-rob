import { api } from './http';
import { getMyRobots, pairRobot } from './pairing';

jest.mock('./http', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('pairing service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('envia o código do robô para iniciar o pareamento', async () => {
    api.post.mockResolvedValue({
      data: { status: 'challenge_sent' },
    });

    const result = await pairRobot('40F52028DDC7');

    expect(api.post).toHaveBeenCalledWith('/users/pair', {
      robotCode: '40F52028DDC7',
    });
    expect(result).toEqual({ status: 'challenge_sent' });
  });

  test('retorna os robôs vinculados ao usuário', async () => {
    const robots = [
      { id: 1, status: 'PAIRED', topic: 'users/2/robots/1' },
    ];
    api.get.mockResolvedValue({ data: { robots } });

    await expect(getMyRobots()).resolves.toEqual(robots);
    expect(api.get).toHaveBeenCalledWith('/users/me');
  });

  test('retorna lista vazia quando a API não traz robôs', async () => {
    api.get.mockResolvedValue({ data: {} });

    await expect(getMyRobots()).resolves.toEqual([]);
  });
});
