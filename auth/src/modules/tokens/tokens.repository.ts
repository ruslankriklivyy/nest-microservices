import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Token } from './entities/token.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

export class TokensRepository extends Repository<Token> {
  constructor(
    @InjectRepository(Token) private tokensRepository: Repository<Token>,
  ) {
    super(
      tokensRepository.target,
      tokensRepository.manager,
      tokensRepository.queryRunner,
    );
  }

  public async findAll(): Promise<Token[]> {
    return this.find();
  }

  public async findById(id: number): Promise<Token> {
    return this.findOneBy({ id });
  }

  public async findByUser(id: number, refreshToken: string): Promise<Token> {
    return this.findOneBy({ id, refresh_token: refreshToken });
  }

  public async store(token: CreateTokenDto): Promise<Token> {
    const newToken = this.create(token);
    return this.save(newToken);
  }

  public async updateOne(
    id: number,
    updateTokenDto: UpdateTokenDto,
  ): Promise<Token> {
    const token = await this.findById(id);
    if (!token) return null;
    Object.assign(token, updateTokenDto);
    return this.save(token);
  }

  public async destroy(id: number): Promise<void> {
    await this.delete(id);
  }
}
