import { api } from './http';
import { sendRobotCommand } from './robots';

jest.mock('./http', () => ({
  api: {
    post: jest.fn(),
  },
}));

describe('robots service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('envia o código para o endpoint do robô correto', async () => {
    api.post.mockResolvedValue({ data: { ok: true } });

    await sendRobotCommand(42, 'import machine');

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/robots/42/command', {
      code: 'import machine',
    });
  });

  test('normaliza o código para string antes de enviar', async () => {
    api.post.mockResolvedValue({ data: { ok: true } });

    await sendRobotCommand(7, 12345);

    expect(api.post).toHaveBeenCalledWith('/robots/7/command', {
      code: '12345',
    });
  });
});
