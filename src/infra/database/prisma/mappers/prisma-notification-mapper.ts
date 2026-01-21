import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Notification as PrismaNotification, Prisma } from "prisma/generated/client";

export class PrismaNotificationMapper {
    static toDomain(raw: PrismaNotification) {
        return Notification.create({
            title: raw.title,
            content: raw.content,
            recipientId: new UniqueEntityId(raw.recipientId),
            readedAt: raw.readAt,
            createdAt: raw.createdAt,
        }, new UniqueEntityId(raw.id));
    }

    static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
        return {
            id: notification.id.toString(),
            recipientId: notification.recipientId.toString(),
            title: notification.title,
            content: notification.content,
            readAt: notification.readedAt,
            createdAt: notification.createdAt,
        }
    }
}
