import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { registerUser } from '../authSlice';
import { supabase } from '../../config/supabaseConfig';

// Mock supabase
jest.mock('../../config/supabaseConfig', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
    from: jest.fn(() => ({
      upsert: jest.fn(),
    })),
  },
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('authSlice', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create a user with Supabase auth', async () => {
      const store = mockStore({});
      const mockUser = { id: '123', email: 'test@test.com' };
      const mockSession = { access_token: 'abc' };
      const mockData = { user: mockUser, session: mockSession };

      supabase.auth.signUp.mockResolvedValue({ data: mockData, error: null });

      const expectedActions = [
        { type: 'auth/register/pending', payload: undefined, meta: expect.any(Object) },
        { type: 'auth/register/fulfilled', payload: { uid: '123', email: 'test@test.com', displayName: 'Test User', role: 'user' }, meta: expect.any(Object) },
      ];

      await store.dispatch(registerUser({ email: 'test@test.com', password: 'password', name: 'Test User' }));

      expect(store.getActions()).toEqual(expectedActions);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      });
      // Note: User profile creation is handled by database trigger
    });
  });
});
