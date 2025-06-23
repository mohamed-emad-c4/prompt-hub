-- CreateTable
CREATE TABLE `PromptVariable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'BOOLEAN', 'SELECT') NOT NULL,
    `options` JSON NULL,
    `defaultValue` VARCHAR(191) NULL,
    `promptId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PromptVariable` ADD CONSTRAINT `PromptVariable_promptId_fkey` FOREIGN KEY (`promptId`) REFERENCES `Prompt`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
