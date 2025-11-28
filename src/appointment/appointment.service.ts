import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { PaginatedResponse } from '../shared/interfaces/paginated-response.interface';
import { User } from '../user/entities/user.entity';
import { Visitor } from '../visitor/entities/visitor.entity';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    private readonly mailService: MailService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const appointmentData: Partial<Appointment> = {
      visitor: { id: createAppointmentDto.visitorId } as Visitor,
      reason: String(createAppointmentDto.reason),
      user: { id: createAppointmentDto.userId } as User,
      startDate: new Date(createAppointmentDto.startDate),
      isInstant: createAppointmentDto.isInstant ? 1 : 0,
      status:
        (createAppointmentDto.status as AppointmentStatus) ||
        AppointmentStatus.PENDIENTE,
    };

    if (createAppointmentDto.endDate) {
      appointmentData.endDate = new Date(createAppointmentDto.endDate);
    }

    if (createAppointmentDto.effectiveStartDate) {
      appointmentData.effectiveStartDate = new Date(
        createAppointmentDto.effectiveStartDate,
      );
    }

    if (createAppointmentDto.effectiveEndDate) {
      appointmentData.effectiveEndDate = new Date(
        createAppointmentDto.effectiveEndDate,
      );
    }

    if (createAppointmentDto.createdBy) {
      appointmentData.createdBy = {
        id: createAppointmentDto.createdBy,
      } as User;
      appointmentData.updatedBy = {
        id: createAppointmentDto.createdBy,
      } as User;
    }

    const appointment = this.appointmentRepo.create(appointmentData);
    const savedAppointment = await this.appointmentRepo.save(appointment);

    const appointmentWithVisitor = await this.appointmentRepo.findOne({
      where: { id: savedAppointment.id },
      relations: ['visitor'],
    });

    if (appointmentWithVisitor?.visitor?.email) {
      try {
        await this.mailService.sendEmailWithQR({
          email: appointmentWithVisitor.visitor.email,
          name: `${appointmentWithVisitor.visitor.name} ${appointmentWithVisitor.visitor.lastName}`,
          code: savedAppointment.id.toString(),
          subject: 'Recordatorio de visita',
          message:
            String(createAppointmentDto.reason) || 'Presentarse en recepción',
        });
      } catch (error) {
        console.error('Failed to send appointment email:', error);
      }
    }

    return savedAppointment;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Appointment>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.appointmentRepo.findAndCount({
      relations: ['visitor', 'user', 'user.area', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      order: {
        startDate: 'DESC',
      },
    });

    return new PaginatedResponse(data, total, page, limit);
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['visitor', 'user', 'user.area', 'createdBy', 'updatedBy'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByVisitor(
    visitorId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Appointment>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.appointmentRepo.findAndCount({
      where: { visitor: { id: visitorId } },
      relations: ['visitor', 'user', 'user.area', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      order: {
        startDate: 'DESC',
      },
    });

    return new PaginatedResponse(data, total, page, limit);
  }

  async findByUser(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Appointment>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.appointmentRepo.findAndCount({
      where: { user: { id: userId } },
      relations: ['visitor', 'user', 'user.area', 'createdBy', 'updatedBy'],
      skip,
      take: limit,
      order: {
        startDate: 'DESC',
      },
    });

    return new PaginatedResponse(data, total, page, limit);
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (updateAppointmentDto.visitorId !== undefined) {
      appointment.visitor = { id: updateAppointmentDto.visitorId } as Visitor;
    }

    if (updateAppointmentDto.reason !== undefined) {
      appointment.reason = String(updateAppointmentDto.reason);
    }

    if (updateAppointmentDto.userId !== undefined) {
      appointment.user = { id: updateAppointmentDto.userId } as User;
    }

    if (updateAppointmentDto.startDate !== undefined) {
      appointment.startDate = new Date(updateAppointmentDto.startDate);
    }

    if (updateAppointmentDto.endDate !== undefined) {
      appointment.endDate = new Date(updateAppointmentDto.endDate);
    }

    if (updateAppointmentDto.isInstant !== undefined) {
      appointment.isInstant = updateAppointmentDto.isInstant ? 1 : 0;
    }

    if (updateAppointmentDto.effectiveStartDate !== undefined) {
      appointment.effectiveStartDate = new Date(
        updateAppointmentDto.effectiveStartDate,
      );
    }

    if (updateAppointmentDto.effectiveEndDate !== undefined) {
      appointment.effectiveEndDate = new Date(
        updateAppointmentDto.effectiveEndDate,
      );
    }

    if (updateAppointmentDto.status !== undefined) {
      appointment.status = updateAppointmentDto.status;
    }

    if (updateAppointmentDto.updatedBy) {
      appointment.updatedBy = { id: updateAppointmentDto.updatedBy } as User;
    }

    return await this.appointmentRepo.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepo.remove(appointment);
  }

  async approve(id: number, approvedById: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.APROBADO;
    appointment.updatedBy = { id: approvedById } as User;
    return await this.appointmentRepo.save(appointment);
  }

  async reject(id: number, rejectedById: number): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.RECHAZADO;
    appointment.updatedBy = { id: rejectedById } as User;
    return await this.appointmentRepo.save(appointment);
  }
}
