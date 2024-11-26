-- AlterTable
ALTER TABLE `users` ADD COLUMN `default_billing_address` INTEGER NULL,
    ADD COLUMN `default_shipping_address` INTEGER NULL;
