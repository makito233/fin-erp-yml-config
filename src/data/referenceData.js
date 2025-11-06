/**
 * Reference data for Money Movements and Invoicing Items
 * Extracted from O2C documentation
 */

export const INVOICING_ITEMS = {
  'GLOVO_to_COURIER': {
    label: '🎈 GLOVO issues to 🛵 COURIER',
    items: [
      {
        name: 'ACTIVATION_FEE_TO_COURIER',
        description: 'Glovo charges courier a one-time activation fee when joining the platform.',
        details: 'Comes from ACTIVATION_FEE_BY_COURIER money movement (same amount). Taxable.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'MATERIAL_FEE_TO_COURIER',
        description: 'Glovo charges courier for materials and equipment provided (delivery bags, branded clothing, etc.).',
        details: 'Comes from MATERIAL_FEE_BY_COURIER money movement (same amount). Taxable.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PLATFORM_FEE_TO_COURIER',
        description: 'Glovo charges courier a platform usage fee for using the courier app and infrastructure.',
        details: 'Comes from PLATFORM_FEE_BY_COURIER money movement (same amount). Taxable.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'SALES_FEE_TO_COURIER',
        description: 'Glovo charges courier a sales-based fee on their delivery volume or earnings.',
        details: 'Comes from SALES_FEE_BY_COURIER money movement (same amount). Taxable.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'OTHER_ADJUSTMENT_TO_COURIER',
        description: 'MANUAL IMPORT: Glovo credits courier for various manual adjustments (debt settlements, corrections, etc.).',
        details: 'Not from automated money movements. Non-taxable balance.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_TO_COURIER',
        description: 'Glovo compensates courier for a delivery fee promotion.',
        details: 'Splits PROMOTION_DELIVERY_FEE_BY_GLOVO into multiple invoicing items. Non-taxable balance.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      }
    ]
  },
  'COURIER_to_CUSTOMER': {
    label: '🛵 COURIER issues to 👤 CUSTOMER',
    items: [
      {
        name: 'DELIVERY_FEE_TO_CUSTOMER',
        description: 'Delivery fee the courier bills directly to the customer.',
        details: 'Only used in BM2/BM4/BM5 where couriers invoice customers directly (GEN2 models). Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'DELIVERY_FEE_TO_GLOVO',
        description: 'Internal accounting entry to balance money flow when customer pays delivery fees but courier gets earnings.',
        details: 'Non-taxable (just balancing). Only used in BM2/BM4/BM5.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_BY_COURIER',
        description: 'Delivery fee discount courier passes to customer.',
        details: 'Used in BM2/BM5 when total promotions exceed what courier would have charged. Non-taxable balance.',
        moneyFlow: 'COURIER → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_BY_COURIER_SPONSORED_BY_GLOVO',
        description: 'Glovo-sponsored delivery discount that courier passes to customer.',
        details: 'Only used in BM5. Glovo pays for the promotion, courier shows it on their invoice. Non-taxable balance.',
        moneyFlow: 'COURIER → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_BY_COURIER_SPONSORED_BY_PARTNER',
        description: 'Partner-sponsored delivery discount that courier passes to customer.',
        details: 'Only used in BM5. Partner pays, courier shows it on invoice. Non-taxable balance.',
        moneyFlow: 'COURIER → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      }
    ]
  },
  'GLOVO_to_CUSTOMER': {
    label: '🎈 GLOVO issues to 👤 CUSTOMER',
    items: [
      {
        name: 'BAD_WEATHER_SURCHARGE_TO_CUSTOMER',
        description: 'Extra fee Glovo charges customer for deliveries during bad weather.',
        details: 'Comes from BAD_WEATHER_SURCHARGE_BY_CUSTOMER money movement (same amount). Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'DELIVERY_FEE_BY_GLOVO',
        description: 'Delivery fee Glovo charges the customer on their invoice.',
        details: 'Calculation depends on business model. Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'FLASH_DEAL_PROMOTION_FROM_GLOVO_TO_CUSTOMER',
        description: 'Glovo shows customer the flash deal discount they\'re receiving.',
        details: 'Splits FLASH_DEAL_PROMOTION_FROM_PARTNER_TO_CUSTOMER into two invoicing items. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'GLOVO_BALANCE_DISCOUNT_TO_CUSTOMER',
        description: 'Discount when service fee calculation results in negative amount.',
        details: 'Only used in BM4 without partner. Taxable.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'MINIMUM_BASKET_SURCHARGE_TO_CUSTOMER',
        description: 'Fee Glovo charges customer when order total is below minimum basket requirement.',
        details: 'Comes from MINIMUM_BASKET_SURCHARGE_BY_CUSTOMER money movement. Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'MPL_DELIVERY_FEE_BY_GLOVO',
        description: 'Delivery fee Glovo charges in marketplace model where partner handles delivery.',
        details: 'Comes from DELIVERY_FEE_BY_CUSTOMER. Non-taxable balance.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'MPL_DELIVERY_FEE_BY_GLOVO_TAXABLE',
        description: 'Delivery fee for VAT-optimised Gen 2 cases with service tax applied.',
        details: 'Taxable version for specific tax optimization scenarios.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PRICING_SERVICE_FEE_TO_CUSTOMER',
        description: 'Glovo charges customer a platform service fee.',
        details: 'Comes from PRICING_SERVICE_FEE_BY_CUSTOMER money movement. Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_REFUND_AFFECTING_COMMISSION_TO_CUSTOMER',
        description: 'Glovo refunds customer for product issues.',
        details: 'Splits PRODUCTS_REFUND_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_REFUND_NOT_AFFECTING_COMMISSION_TO_CUSTOMER',
        description: 'Glovo refunds customer for product issues (commission not affected).',
        details: 'Splits PRODUCTS_REFUND_NOT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_TO_CUSTOMER',
        description: 'Glovo charges customer for products purchased.',
        details: 'Comes from PRODUCTS_BY_CUSTOMER money movement. Non-taxable balance.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_BAD_WEATHER_SURCHARGE_TO_CUSTOMER',
        description: 'Glovo gives discount to customer for bad weather surcharge.',
        details: 'Glovo-sponsored promotion. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_BY_GLOVO',
        description: 'Delivery fee discount Glovo gives to customer (\'Free Delivery\' promotions).',
        details: 'Calculation depends on business model. Taxable.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_TO_CUSTOMER',
        description: 'Delivery fee discount shown to customer (non-taxable).',
        details: 'From partner-sponsored promotions. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_TO_CUSTOMER_TAXABLE',
        description: 'Delivery fee discount (taxable version).',
        details: 'Used in countries where promotions must be taxed. Taxable.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_MINIMUM_BASKET_SURCHARGE_TO_CUSTOMER',
        description: 'Glovo gives customer a discount on minimum basket surcharge.',
        details: 'Based on PROMOTION_MINIMUM_BASKET_SURCHARGE_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_PRODUCT_AFFECTING_COMMISSION_TO_CUSTOMER',
        description: 'Glovo shows customer a product discount that partner sponsored.',
        details: 'Splits PROMOTION_PRODUCT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_PRODUCT_NOT_AFFECTING_COMMISSION_TO_CUSTOMER',
        description: 'Product discount that partner sponsored (commission not affected).',
        details: 'Splits PROMOTION_PRODUCT_NOT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_PRODUCT_TO_CUSTOMER',
        description: 'Glovo gives customer a product discount (Glovo-sponsored promotion like \'20% off\').',
        details: 'Comes from PROMOTION_PRODUCT_BY_GLOVO money movement. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'REFUND_TO_CUSTOMER',
        description: 'Glovo refunds customer for order issues (missing items, quality problems, etc.).',
        details: 'Comes from REFUND_BY_GLOVO money movement. Non-taxable balance.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'SERVICE_FEE_TO_CUSTOMER',
        description: 'Platform service fee Glovo charges customer.',
        details: 'Only used in BM4. Replaces DELIVERY_FEE_BY_GLOVO. Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'TIP_TO_CUSTOMER',
        description: 'Glovo shows the customer their tip amount on the invoice/receipt.',
        details: 'Comes from TIP_BY_CUSTOMER money movement. Non-taxable balance.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRIME_SUBSCRIPTION_TO_CUSTOMER',
        description: 'Glovo charges customer for Prime subscription membership fee.',
        details: 'Comes from PRIME_SUBSCRIPTION_BY_CUSTOMER money movement. Taxable.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_PRIME_SUBSCRIPTION_TO_CUSTOMER',
        description: 'Glovo gives customer a Prime subscription discount.',
        details: 'Comes from PROMOTION_PRIME_SUBSCRIPTION_BY_GLOVO money movement. Taxable.',
        moneyFlow: 'GLOVO → CUSTOMER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      }
    ]
  },
  'COURIER_to_GLOVO': {
    label: '🛵 COURIER issues to 🎈 GLOVO',
    items: [
      {
        name: 'CASH_COLLECTED_BY_COURIER',
        description: 'Courier owes Glovo for cash collected from customers (cash-on-delivery).',
        details: 'Comes from CASH_COLLECTED_BY_COURIER money movement. Non-taxable balance.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'CASH_OUT_BY_COURIER',
        description: 'Courier\'s balance is reduced for cash earnings already paid out.',
        details: 'Comes from CASH_OUT_BY_COURIER money movement. Non-taxable balance.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'CHALLENGE_REWARD_BY_COURIER',
        description: 'Courier bills Glovo for challenge reward (completing delivery goals).',
        details: 'Comes from CHALLENGE_REWARD_TO_COURIER money movement. Taxable.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'EXTERNAL_EARNINGS_BONUS_BY_COURIER',
        description: 'Courier bills Glovo for special bonuses (exceptional performance, compensation, etc.).',
        details: 'Comes from EXTERNAL_EARNINGS_BONUS_TO_COURIER money movement. Taxable.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'FRAUD_BY_COURIER',
        description: 'Courier owes Glovo for fraudulent activities detected.',
        details: 'Comes from FRAUD_BY_COURIER money movement. Non-taxable balance.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'GUARANTEE_BY_COURIER',
        description: 'Courier bills Glovo for minimum earnings guarantee payment.',
        details: 'Comes from GUARANTEE_TO_COURIER money movement. Taxable.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCT_INCIDENTS_BY_COURIER',
        description: 'Courier owes Glovo for product incidents they caused.',
        details: 'Comes from PRODUCT_INCIDENTS_BY_COURIER money movement. Non-taxable balance.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'REFERRAL_BY_COURIER',
        description: 'Courier bills Glovo for referring new couriers to the platform.',
        details: 'Comes from REFERRAL_TO_COURIER money movement. Taxable. NET amount.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'TIP_BY_COURIER',
        description: 'Courier bills Glovo for tips received.',
        details: 'Comes from TIP_TO_COURIER money movement. Non-taxable balance.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'OTHER_ADJUSTMENT_BY_COURIER',
        description: 'MANUAL IMPORT: Courier owes Glovo for various manual adjustments.',
        details: 'Not from automated money movements. Non-taxable balance.',
        moneyFlow: 'COURIER → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'CPO_ASSUMED_BY_GLOVO',
        description: 'Courier bills Glovo for delivery service.',
        details: 'Only in BM4 with aggregated invoicing. Taxable.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'DELIVERY_FEE_BY_COURIER',
        description: 'Payment courier invoices to Glovo for completing a delivery.',
        details: 'NET amount (after tax). Amount depends on business model.',
        moneyFlow: 'CUSTOMER → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'ORDER_EARNINGS_BY_COURIER',
        description: 'Courier bills Glovo for delivery service (Cost Per Order / CPO).',
        details: 'Used in Default/BM1/BM8. Comes from ORDER_EARNINGS_TO_COURIER. Taxable NET amount.',
        moneyFlow: 'GLOVO → COURIER',
        taxation: 'TAXABLE',
        amountType: 'NET'
      }
    ]
  },
  'COURIER_to_PARTNER': {
    label: '🛵 COURIER issues to 🏪 STORE_ADDRESS',
    items: [
      {
        name: 'CPO_ASSUMED_BY_PARTNER',
        description: 'Courier bills partner directly for delivery service.',
        details: 'Only in BM4 with standard invoicing when courier costs exceed customer coverage. Taxable.',
        moneyFlow: 'STORE_ADDRESS → COURIER',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      }
    ]
  },
  'GLOVO_to_PARTNER': {
    label: '🎈 GLOVO issues to 🏪 STORE_ADDRESS',
    items: [
      {
        name: 'MKT_GMO_DEBIT_TO_PARTNER',
        description: 'Glovo charges partner for advertising/marketing campaigns on the platform.',
        details: 'Comes from MKT_GMO_DEBIT_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_ACTIONS_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Marketing Actions campaign.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_BOOST_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Marketing Boost campaign.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_CRM_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for CRM Marketing campaign.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_DFP_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Display & Featured Products marketing.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_KEYWORDS_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Keywords Marketing campaign.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_OTHER_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Other Marketing campaigns.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_POSITIONING_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Positioning/Placement marketing.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'MKT_SEARCH_TO_PARTNER',
        description: 'MANUAL IMPORT: Glovo charges partner for Search Marketing campaign.',
        details: 'Not from money movements. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'BAD_WEATHER_SURCHARGE_TO_PARTNER',
        description: 'Glovo pays partner the bad weather surcharge collected from customer.',
        details: 'Comes from BAD_WEATHER_SURCHARGE_TO_PARTNER money movement. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'BAD_WEATHER_SURCHARGE_TO_PARTNER_TAXABLE',
        description: 'Bad weather surcharge with food VAT applied for VAT optimisation.',
        details: 'Comes from BAD_WEATHER_SURCHARGE_TO_PARTNER money movement. Taxable.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'COMMISSION_TO_PARTNER',
        description: 'Commission fee Glovo charges partner for facilitating the sale.',
        details: 'Comes from COMMISSION_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'CPO_ASSUMED_TO_GLOVO',
        description: 'Fee Glovo charges partner for courier delivery costs.',
        details: 'Only in BM4 with aggregated invoicing. Taxable.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'FLASH_DEAL_FEE_FROM_GLOVO_TO_PARTNER',
        description: 'Glovo charges partner for featuring products in flash deals.',
        details: 'Comes from FLASH_DEAL_FEE_FROM_PARTNER_TO_GLOVO money movement. Taxable.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'FLASH_DEAL_PROMOTION_FROM_GLOVO_TO_PARTNER',
        description: 'Glovo charges partner for the flash deal discount given to customers.',
        details: 'Comes from FLASH_DEAL_PROMOTION_FROM_PARTNER_TO_CUSTOMER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'GLOVO_BALANCE_DISCOUNT_TO_PARTNER',
        description: 'Discount when commission minus courier costs results in negative amount.',
        details: 'Only in BM4 with aggregated invoicing. Taxable.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'GLOVO_BALANCE_VOUCHER_TO_PARTNER',
        description: 'Credit when commission minus courier costs results in negative amount (non-taxable).',
        details: 'Only in BM4 with standard invoicing. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'INCIDENT_COMMISSION_TO_PARTNER',
        description: 'Glovo credits partner a commission adjustment due to order incident.',
        details: 'Comes from INCIDENT_COMMISSION_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'INCIDENT_PRODUCTS_AFFECTING_COMMISSION_TO_PARTNER',
        description: 'Glovo pays partner for replacement products added due to incidents (affects commission).',
        details: 'Comes from INCIDENT_PRODUCTS_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'INCIDENT_PRODUCTS_NOT_AFFECTING_COMMISSION_TO_PARTNER',
        description: 'Glovo pays partner for replacement products (doesn\'t affect commission).',
        details: 'Comes from INCIDENT_PRODUCTS_NOT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'MINIMUM_BASKET_SURCHARGE_TO_PARTNER',
        description: 'Glovo pays partner the minimum basket surcharge collected from customer.',
        details: 'Comes from MINIMUM_BASKET_SURCHARGE_TO_PARTNER money movement. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'MINIMUM_BASKET_SURCHARGE_TO_PARTNER_TAXABLE',
        description: 'Minimum basket surcharge with food VAT applied for VAT optimisation.',
        details: 'Comes from MINIMUM_BASKET_SURCHARGE_TO_PARTNER money movement. Taxable.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'MPL_DELIVERY_FEE_TO_PARTNER',
        description: 'Payment Glovo makes to partner for handling their own delivery.',
        details: 'Used in marketplace model. Comes from DELIVERY_FEE_TO_PARTNER. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'MPL_DELIVERY_FEE_TO_PARTNER_TAXABLE',
        description: 'Payment for partner delivery with food tax applied.',
        details: 'For Gen2 orders to VAT optimise. Taxable.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PRIME_ORDER_VENDOR_FEE_FROM_GLOVO_TO_PARTNER',
        description: 'Glovo charges partner a Prime order vendor fee.',
        details: 'Comes from PRIME_ORDER_VENDOR_FEE_FROM_PARTNER_TO_GLOVO. Taxable.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_PAID_IN_CASH_BY_CUSTOMER_REDUCE_BALANCE_TO_PARTNER',
        description: 'Glovo reduces partner balance when customer paid in cash directly to partner.',
        details: 'Comes from PRODUCTS_IN_CASH_BY_CUSTOMER_REDUCE_BALANCE_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_PAID_IN_CASH_BY_GLOVO_REDUCE_BALANCE_TO_PARTNER',
        description: 'Glovo reduces partner balance when Glovo paid them in cash.',
        details: 'Courier delivered cash to partner on Glovo\'s behalf. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_PAID_IN_CASH_REDUCE_BALANCE_TO_PARTNER',
        description: 'DEPRECATED. Glovo reduces partner balance when customer paid in cash.',
        details: 'Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_PAID_WITH_VOUCHER_REDUCE_BALANCE_TO_PARTNER',
        description: 'Glovo reduces partner balance when customer used a voucher/gift card.',
        details: 'Comes from PRODUCTS_PAID_WITH_VOUCHER_REDUCE_BALANCE_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_REFUND_AFFECTING_COMMISSION_TO_PARTNER',
        description: 'Glovo charges partner for a product refund that affects commission.',
        details: 'Comes from PRODUCTS_REFUND_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_REFUND_NOT_AFFECTING_COMMISSION_TO_PARTNER',
        description: 'Glovo charges partner for a product refund (commission NOT affected).',
        details: 'Comes from PRODUCTS_REFUND_NOT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PRODUCTS_TO_PARTNER',
        description: 'Glovo pays the partner for products sold.',
        details: 'Comes from PRODUCTS_TO_PARTNER money movement. Non-taxable balance.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_TO_PARTNER',
        description: 'Fee Glovo charges partner for a delivery promotion the partner sponsored.',
        details: 'Comes from PROMOTION_DELIVERY_FEE_BY_PARTNER. Used in BM2/BM5. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_TO_PARTNER_TAXABLE',
        description: 'Partner-sponsored delivery promotion (taxable version).',
        details: 'Used in countries where promotions must be taxed. Taxable.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_MINIMUM_BASKET_SURCHARGE_TO_PARTNER',
        description: 'Glovo charges partner for waiving the minimum basket surcharge.',
        details: 'Comes from PROMOTION_MINIMUM_BASKET_SURCHARGE_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_PRODUCT_AFFECTING_COMMISSION_TO_PARTNER',
        description: 'Glovo charges partner for product discount (affects commission calculation).',
        details: 'Comes from PROMOTION_PRODUCT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'PROMOTION_PRODUCT_NOT_AFFECTING_COMMISSION_TO_PARTNER',
        description: 'Glovo charges partner for product discount (doesn\'t affect commission).',
        details: 'Comes from PROMOTION_PRODUCT_NOT_AFFECTING_COMMISSION_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'SERVICE_FEE_PAID_IN_CASH_TO_PARTNER',
        description: 'Glovo charges partner when customer paid service fee in cash to partner.',
        details: 'Comes from SERVICE_FEE_PAID_IN_CASH_REDUCE_BALANCE_BY_PARTNER. Non-taxable balance.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'GROSS'
      },
      {
        name: 'WAITING_TIME_FEE_TAXABLE_REFUND_TO_PARTNER',
        description: 'Glovo refunds partner a waiting time fee that was charged incorrectly.',
        details: 'Comes from WAITING_TIME_FEE_TAXABLE_REFUND_TO_PARTNER. Taxable NET amount.',
        moneyFlow: 'GLOVO → STORE_ADDRESS',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'WAITING_TIME_FEE_TO_PARTNER',
        description: 'Glovo charges partner a waiting time fee (taxable version).',
        details: 'From WAITING_TIME_FEE_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'WAITING_TIME_FEE_TO_PARTNER_NON_TAXABLE',
        description: 'Glovo charges partner a waiting time fee (non-taxable version).',
        details: 'From WAITING_TIME_FEE_BY_PARTNER money movement. Non-taxable balance NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'NET'
      },
      {
        name: 'MATERIAL_FEE_TO_PARTNER',
        description: 'Glovo charges partner for materials and supplies provided.',
        details: 'Comes from MATERIAL_FEE_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'PLATFORM_FEE_TO_PARTNER',
        description: 'Glovo charges partner a platform usage fee for using Glovo\'s infrastructure.',
        details: 'Comes from PLATFORM_FEE_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'SALES_FEE_TO_PARTNER',
        description: 'Glovo charges partner a sales-based fee (separate from commission).',
        details: 'Comes from SALES_FEE_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'SANCTIONS_TO_PARTNER',
        description: 'Glovo charges partner a sanction/penalty for policy violations or quality issues.',
        details: 'Comes from SANCTIONS_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      },
      {
        name: 'INSTANT_PAYOUTS_ALREADY_PAID_TO_PARTNER',
        description: 'Glovo records instant payout already transferred to partner, reducing their balance.',
        details: 'Comes from INSTANT_PAYOUTS_ALREADY_PAID_TO_PARTNER. Non-taxable balance NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'NON_TAXABLE_BALANCE',
        amountType: 'NET'
      },
      {
        name: 'INSTANT_PAYOUTS_FEE_TO_PARTNER',
        description: 'Glovo charges partner a fee for instant payout service.',
        details: 'Comes from INSTANT_PAYOUTS_FEE_BY_PARTNER money movement. Taxable NET amount.',
        moneyFlow: 'STORE_ADDRESS → GLOVO',
        taxation: 'TAXABLE',
        amountType: 'NET'
      }
    ]
  }
}

export const MONEY_MOVEMENTS = {
  'COURIER_to_GLOVO': {
    label: '🛵 COURIER → 🎈 GLOVO',
    items: [
      {
        name: 'ACTIVATION_FEE_BY_COURIER',
        description: 'One-time activation fee charged when courier joins the Glovo platform.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'CASH_COLLECTED_BY_COURIER',
        description: 'Cash collected by courier from customers on behalf of Glovo (cash-on-delivery orders).',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'CASH_OUT_BY_COURIER',
        description: 'Records cash earnings already paid to courier, reducing their balance.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'FRAUD_BY_COURIER',
        description: 'Charges to courier for fraudulent activities detected on their account.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'MATERIAL_FEE_BY_COURIER',
        description: 'Fee charged to couriers for physical materials and equipment provided by Glovo.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'PLATFORM_FEE_BY_COURIER',
        description: 'Platform usage fee charged to couriers for using Glovo\'s infrastructure and courier app.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'PRODUCT_INCIDENTS_BY_COURIER',
        description: 'Charges to courier for product-related incidents caused by the courier.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'SALES_FEE_BY_COURIER',
        description: 'Sales-based fee charged to couriers based on delivery volume or earnings.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      }
    ]
  },
  'CUSTOMER_to_GLOVO': {
    label: '👤 CUSTOMER → 🎈 GLOVO',
    items: [
      {
        name: 'BAD_WEATHER_SURCHARGE_BY_CUSTOMER',
        description: 'Extra fee charged to customers during bad weather to compensate for difficult delivery conditions.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'DELIVERY_FEE_BY_CUSTOMER',
        description: 'Delivery fee paid by customer for order delivery. Includes surge fees during high demand.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'MINIMUM_BASKET_SURCHARGE_BY_CUSTOMER',
        description: 'Fee charged when order value is below the store\'s minimum basket requirement.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRICING_SERVICE_FEE_BY_CUSTOMER',
        description: 'Service fee charged by Glovo for providing the platform and service.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_BY_CUSTOMER',
        description: 'The cost of products/items that the customer ordered.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'TIP_BY_CUSTOMER',
        description: 'Optional tip paid by customer for the courier (Glovo later transfers to courier).',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRIME_SUBSCRIPTION_BY_CUSTOMER',
        description: 'Subscription fee customers pay for Glovo Prime membership.',
        taxType: 'GROSS',
        source: 'PRIME_SUBSCRIPTION'
      }
    ]
  },
  'GLOVO_to_COURIER': {
    label: '🎈 GLOVO → 🛵 COURIER',
    items: [
      {
        name: 'CHALLENGE_REWARD_TO_COURIER',
        description: 'Bonus payment for completing delivery challenges.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'EXTERNAL_EARNINGS_BONUS_TO_COURIER',
        description: 'Special one-time bonuses for couriers (promotions, compensation, exceptional performance).',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'GUARANTEE_TO_COURIER',
        description: 'Minimum earnings guarantee payment ensuring couriers earn a minimum amount.',
        taxType: 'NET',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'REFERRAL_TO_COURIER',
        description: 'Bonus payment to courier for referring new couriers to Glovo.',
        taxType: 'NET',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'TIP_TO_COURIER',
        description: 'Tips transferred to couriers via account entry system.',
        taxType: 'GROSS',
        source: 'COURIER_ACCOUNT_ENTRY'
      },
      {
        name: 'ORDER_EARNINGS_TO_COURIER',
        description: 'Payment to courier for completing a delivery (Cost Per Order / CPO).',
        taxType: 'NET',
        source: 'ORDER'
      }
    ]
  },
  'GLOVO_to_CUSTOMER': {
    label: '🎈 GLOVO → 👤 CUSTOMER',
    items: [
      {
        name: 'PROMOTION_BAD_WEATHER_SURCHARGE_BY_GLOVO',
        description: 'Discount on bad weather surcharge sponsored by Glovo.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_BY_GLOVO',
        description: 'Delivery fee discount sponsored by Glovo to the customer (\'Free delivery\' promotions).',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_PRODUCT_BY_GLOVO',
        description: 'Product discount/promotion sponsored by Glovo to the customer.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'REFUND_BY_GLOVO',
        description: 'Money refunded by Glovo to customer due to order issues.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_PRIME_SUBSCRIPTION_BY_GLOVO',
        description: 'Promotional discount on Prime subscription sponsored by Glovo.',
        taxType: 'GROSS',
        source: 'PRIME_SUBSCRIPTION'
      }
    ]
  },
  'GLOVO_to_PARTNER': {
    label: '🎈 GLOVO → 🏪 STORE_ADDRESS',
    items: [
      {
        name: 'BAD_WEATHER_SURCHARGE_TO_PARTNER',
        description: 'Bad weather surcharge collected from customer, transferred to partner.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'DELIVERY_FEE_TO_PARTNER',
        description: 'Delivery fee paid to partner when partner handles their own delivery.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'INCIDENT_COMMISSION_BY_PARTNER',
        description: 'Commission refund/adjustment to partner due to order incidents.',
        taxType: 'NET',
        source: 'ORDER'
      },
      {
        name: 'INCIDENT_PRODUCTS_AFFECTING_COMMISSION_BY_PARTNER',
        description: 'Additional products added due to incidents that increase commission calculation.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'INCIDENT_PRODUCTS_NOT_AFFECTING_COMMISSION_BY_PARTNER',
        description: 'Additional products added due to incidents that do NOT affect commission.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'MINIMUM_BASKET_SURCHARGE_TO_PARTNER',
        description: 'Minimum basket surcharge transferred from Glovo to partner.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_TO_PARTNER',
        description: 'Payment for products sold, transferred from Glovo to the partner.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'WAITING_TIME_FEE_TAXABLE_REFUND_TO_PARTNER',
        description: 'Refund of a waiting time fee back to the partner (if charged incorrectly).',
        taxType: 'NET',
        source: 'ORDER'
      }
    ]
  },
  'PARTNER_to_CUSTOMER': {
    label: '🏪 STORE_ADDRESS → 👤 CUSTOMER',
    items: [
      {
        name: 'FLASH_DEAL_PROMOTION_FROM_PARTNER_TO_CUSTOMER',
        description: 'Discount on flash deal items, paid by the partner to the customer.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_REFUND_AFFECTING_COMMISSION_BY_PARTNER',
        description: 'Refund amount charged to partner that reduces Glovo\'s commission.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_REFUND_NOT_AFFECTING_COMMISSION_BY_PARTNER',
        description: 'Refund amount charged to partner that does NOT reduce commission.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_DELIVERY_FEE_BY_PARTNER',
        description: 'Delivery fee discount sponsored and paid by partner to reduce customer delivery cost.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_MINIMUM_BASKET_SURCHARGE_BY_PARTNER',
        description: 'Partner-sponsored discount that waives or reduces the minimum basket surcharge.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_PRODUCT_AFFECTING_COMMISSION_BY_PARTNER',
        description: 'Product discount sponsored by partner that reduces the commission partner pays to Glovo.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PROMOTION_PRODUCT_NOT_AFFECTING_COMMISSION_BY_PARTNER',
        description: 'Product discount sponsored by partner that does NOT reduce commission.',
        taxType: 'GROSS',
        source: 'ORDER'
      }
    ]
  },
  'PARTNER_to_GLOVO': {
    label: '🏪 STORE_ADDRESS → 🎈 GLOVO',
    items: [
      {
        name: 'MKT_GMO_DEBIT_BY_PARTNER',
        description: 'Advertising fees charged to partners for marketing campaigns on the Glovo platform.',
        taxType: 'NET',
        source: 'ADS_REPORT'
      },
      {
        name: 'COMMISSION_BY_PARTNER',
        description: 'Commission fee Glovo charges partner for facilitating the sale.',
        taxType: 'NET',
        source: 'ORDER'
      },
      {
        name: 'FLASH_DEAL_FEE_FROM_PARTNER_TO_GLOVO',
        description: 'Fee charged to partners when their products are featured in flash deals.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRIME_ORDER_VENDOR_FEE_FROM_PARTNER_TO_GLOVO',
        description: 'Fee charged to partners for orders from Glovo Prime members.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_IN_CASH_BY_CUSTOMER_REDUCE_BALANCE_BY_PARTNER',
        description: 'Products paid in cash by customer directly to partner. Reduces partner balance with Glovo.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_IN_CASH_BY_GLOVO_REDUCE_BALANCE_BY_PARTNER',
        description: 'Cash Glovo paid to partner on behalf of customer. Reduces partner balance.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'PRODUCTS_PAID_WITH_VOUCHER_REDUCE_BALANCE_BY_PARTNER',
        description: 'Products paid with voucher/gift card. Reduces partner balance with Glovo.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'SERVICE_FEE_PAID_IN_CASH_REDUCE_BALANCE_BY_PARTNER',
        description: 'Service fee paid in cash by customer to partner. Reduces partner balance.',
        taxType: 'GROSS',
        source: 'ORDER'
      },
      {
        name: 'WAITING_TIME_FEE_BY_PARTNER',
        description: 'Fee charged to partner when courier waits too long for order preparation.',
        taxType: 'NET',
        source: 'ORDER'
      },
      {
        name: 'MATERIAL_FEE_BY_PARTNER',
        description: 'Fee charged to partners for materials and supplies provided by Glovo.',
        taxType: 'NET',
        source: 'PARTNER_FEES'
      },
      {
        name: 'PLATFORM_FEE_BY_PARTNER',
        description: 'Platform usage fee charged to partners for using Glovo\'s infrastructure and services.',
        taxType: 'NET',
        source: 'PARTNER_FEES'
      },
      {
        name: 'SALES_FEE_BY_PARTNER',
        description: 'Sales-based fee charged to partners, calculated based on sales volume.',
        taxType: 'NET',
        source: 'PARTNER_FEES'
      },
      {
        name: 'SANCTIONS_BY_PARTNER',
        description: 'Penalties charged to partners for policy violations or quality issues.',
        taxType: 'NET',
        source: 'PARTNER_FEES'
      },
      {
        name: 'INSTANT_PAYOUTS_ALREADY_PAID_TO_PARTNER',
        description: 'Records instant payout amount already transferred to partner.',
        taxType: 'NET',
        source: 'PAYOUT'
      },
      {
        name: 'INSTANT_PAYOUTS_FEE_BY_PARTNER',
        description: 'Fee charged to partners for using instant payout service.',
        taxType: 'GROSS',
        source: 'PAYOUT'
      }
    ]
  }
}

// Helper to get all invoicing item names
export function getAllInvoicingItemNames() {
  const names = []
  Object.values(INVOICING_ITEMS).forEach(category => {
    category.items.forEach(item => {
      names.push(item.name)
    })
  })
  return names.sort()
}

// Helper to get all money movement names
export function getAllMoneyMovementNames() {
  const names = []
  Object.values(MONEY_MOVEMENTS).forEach(category => {
    category.items.forEach(item => {
      names.push(item.name)
    })
  })
  return names.sort()
}

// Helper to find item details by name
export function getInvoicingItemDetails(name) {
  for (const category of Object.values(INVOICING_ITEMS)) {
    const item = category.items.find(i => i.name === name)
    if (item) return item
  }
  return null
}

export function getMoneyMovementDetails(name) {
  for (const category of Object.values(MONEY_MOVEMENTS)) {
    const item = category.items.find(i => i.name === name)
    if (item) return item
  }
  return null
}

