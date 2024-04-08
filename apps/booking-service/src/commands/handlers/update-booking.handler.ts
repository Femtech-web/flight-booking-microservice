import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookingCommand } from '../impl/update-booking.command';
import { BookingEntity } from '../../entities/booking.entity';

@CommandHandler(UpdateBookingCommand)
export class UpdateBookingHandler
  implements ICommandHandler<UpdateBookingCommand>
{
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
  ) {}

  async execute(command: UpdateBookingCommand) {
    const { id, updatedBooking } = command.updateBookingDto;
    const { customer_id } = updatedBooking;
    try {
      await this.bookingRepository.update({ id }, { customer_id });

      const booking = await this.bookingRepository.findOne({ where: { id } });
      return booking;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}