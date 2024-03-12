import User from '../models/sequelizeModel';

interface UserData {
  coins: number;
  email: string;
  tgUserId: string;
  spins: number;
  losses: number;
  firstTime: boolean;
}

interface SpinData {
    tgUserId: string;
    spins: number;
    losses: number;
    coins: number;
}

interface EmailData {
    tgUserId: string;
    email: string;
}

interface AddCoinsData {
    tgUserId: string;
    coins: number;
  }

async function fetchUserData(tgUserId: string): Promise<UserData | null> {
  try {
    const user = await User.findOne({
      where: {
        tgUserId: tgUserId
      }
    });
    if (user) {
      return {
        coins: user.coins,
        email: user.email,
        tgUserId: user.tgUserId,
        spins: user.spins,
        losses: user.losses,
        firstTime: user.firstTime
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

async function saveUserData(userData: UserData): Promise<User> {
    try {
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
}

async function saveEmail(emailData: EmailData): Promise<[number, User[]]> {
    try {
      const [affectedCount, updatedUsers] = await User.update(
        { email: emailData.email },
        { where: { tgUserId: emailData.tgUserId }, returning: true }
      );
      return [affectedCount, updatedUsers];
    } catch (error) {
      console.error('Error saving email:', error);
      throw error;
    }
}

async function recordSpin(spinData: SpinData): Promise<[number, User[]]> {
    try {
      const [affectedCount, updatedUsers] = await User.update(
        { spins: spinData.spins, losses: spinData.losses, coins: spinData.coins },
        { where: { tgUserId: spinData.tgUserId }, returning: true }
      );
      return [affectedCount, updatedUsers];
    } catch (error) {
      console.error('Error recording spin:', error);
      throw error;
    }
}

async function addCoins(addCoinsData: AddCoinsData): Promise<[number, User[]]> {
    try {
      const [affectedCount, updatedUsers] = await User.update(
        { coins: addCoinsData.coins },
        { where: { tgUserId: addCoinsData.tgUserId }, returning: true }
      );
      return [affectedCount, updatedUsers];
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  }
  
export { fetchUserData, saveUserData, saveEmail, addCoins, recordSpin };