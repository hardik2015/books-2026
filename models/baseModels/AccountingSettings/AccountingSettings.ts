import { Doc } from 'fyo/model/doc';
import {
  ChangeArg,
  FiltersMap,
  HiddenMap,
  ListsMap,
  ReadOnlyMap,
  ValidationMap,
} from 'fyo/model/types';
import { validateEmail } from 'fyo/model/validationFunction';
import { InventorySettings } from 'models/inventory/InventorySettings';
import { ModelNameEnum } from 'models/types';
import { createDiscountAccount } from 'src/setup/setupInstance';
import { getCountryInfo } from 'utils/misc';
import { validateCompanyDetailsChange, showCompanyDetailsLockError } from 'src/utils/companyValidation';

export class AccountingSettings extends Doc {
  companyName?: string;
  fullname?: string;
  email?: string;
  country?: string;
  setupComplete?: boolean;

  enableDiscounting?: boolean;
  enableInventory?: boolean;
  enablePriceList?: boolean;
  enableLead?: boolean;
  enableCouponCode?: boolean;
  enableFormCustomization?: boolean;
  enableInvoiceReturns?: boolean;
  enableLoyaltyProgram?: boolean;
  enablePricingRule?: boolean;
  enaenableItemEnquiry?: boolean;
  enableERPNextSync?: boolean;
  enablePointOfSaleWithOutInventory?: boolean;
  enablePartialPayment?: boolean;
  enableitemGroup?: boolean;

  static filters: FiltersMap = {
    writeOffAccount: () => ({
      isGroup: false,
      rootType: 'Expense',
    }),
    roundOffAccount: () => ({
      isGroup: false,
      rootType: 'Expense',
    }),
    discountAccount: () => ({
      isGroup: false,
      rootType: 'Income',
    }),
  };

  validations: ValidationMap = {
    email: validateEmail,
    async companyName(value) {
      // Validate that company name hasn't been changed after setup
      if (this instanceof AccountingSettings) {
        const originalValues = await this.fyo.db.getDoc('AccountingSettings', '');
        const newValues = { companyName: value };

        const isValid = await validateCompanyDetailsChange(
          this.fyo,
          newValues,
          { companyName: originalValues?.companyName }
        );

        if (!isValid) {
          await showCompanyDetailsLockError('Company Name');
          return false;
        }
      }
      return true;
    },
    async fullname(value) {
      // Validate that fullname hasn't been changed after setup
      if (this instanceof AccountingSettings) {
        const originalValues = await this.fyo.db.getDoc('AccountingSettings', '');
        const newValues = { fullname: value };

        const isValid = await validateCompanyDetailsChange(
          this.fyo,
          newValues,
          { fullname: originalValues?.fullname }
        );

        if (!isValid) {
          await showCompanyDetailsLockError('Contact Person');
          return false;
        }
      }
      return true;
    },
    async email(value) {
      // Validate that email hasn't been changed after setup
      if (this instanceof AccountingSettings) {
        const originalValues = await this.fyo.db.getDoc('AccountingSettings', '');
        const newValues = { email: value };

        const isValid = await validateCompanyDetailsChange(
          this.fyo,
          newValues,
          { email: originalValues?.email }
        );

        if (!isValid) {
          await showCompanyDetailsLockError('Email');
          return false;
        }
      }
      return true;
    },
  };

  static lists: ListsMap = {
    country: () => Object.keys(getCountryInfo()),
  };

  readOnly: ReadOnlyMap = {
    companyName: function() {
      // Make company name read-only after setup is complete
      return !!this.setupComplete;
    },
    fullname: function() {
      // Make fullname read-only after setup is complete
      return !!this.setupComplete;
    },
    email: function() {
      // Make email read-only after setup is complete
      return !!this.setupComplete;
    },
    country: function() {
      // Make country read-only after setup is complete
      return !!this.setupComplete;
    },
    enableDiscounting: () => {
      return !!this.enableDiscounting;
    },
    enableInventory: () => {
      return !!this.enableInventory;
    },
    enableLead: () => {
      return !!this.enableLead;
    },
    enableERPNextSync: () => {
      return !!this.enableERPNextSync;
    },
    enableInvoiceReturns: () => {
      return !!this.enableInvoiceReturns;
    },
    enableLoyaltyProgram: () => {
      return !!this.enableLoyaltyProgram;
    },
    enablePointOfSaleWithOutInventory: () => {
      return !!this.enablePointOfSaleWithOutInventory;
    },
    enableitemGroup: () => {
      return !!this.enableitemGroup;
    },
  };

  override hidden: HiddenMap = {
    discountAccount: () => !this.enableDiscounting,
    gstin: () => this.fyo.singles.SystemSettings?.countryCode !== 'in',
    enablePricingRule: () =>
      !this.fyo.singles.AccountingSettings?.enableDiscounting,
    enableCouponCode: () =>
      !this.fyo.singles.AccountingSettings?.enablePricingRule,
  };

  async change(ch: ChangeArg) {
    const discountingEnabled =
      ch.changed === 'enableDiscounting' && this.enableDiscounting;
    const discountAccountNotSet = !this.discountAccount;

    if (discountingEnabled && discountAccountNotSet) {
      await createDiscountAccount(this.fyo);
    }

    if (
      ch.changed == 'enablePointOfSaleWithOutInventory' &&
      this.enablePointOfSaleWithOutInventory
    ) {
      const inventorySettings = (await this.fyo.doc.getDoc(
        ModelNameEnum.InventorySettings
      )) as InventorySettings;

      await inventorySettings.set('enableBatches', true);
      await inventorySettings.set('enableUomConversions', true);
      await inventorySettings.set('enableSerialNumber', true);
      await inventorySettings.set('enableBarcodes', true);
      await inventorySettings.set('enablePointOfSale', true);

      await inventorySettings.sync();
    }
  }
}
