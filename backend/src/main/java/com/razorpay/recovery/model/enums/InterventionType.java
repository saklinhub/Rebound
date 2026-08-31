package com.razorpay.recovery.model.enums;

public enum InterventionType {
    // Payment Degradation
    RETRY_SAME_METHOD,
    ROUTE_TO_UPI,
    ROUTE_TO_NETBANKING,
    REQUEST_NEW_CARD,
    FLAG_FOR_HUMAN,

    // Checkout Recovery
    SEND_CART_LINK,
    SEND_OFFER,
    MARK_LOST,

    // Subscription Recovery
    SOFT_RETRY,
    ALTERNATE_METHOD,
    SEND_UPDATE_LINK,
    FINAL_NOTICE,
    GRACEFUL_DOWNGRADE,

    // Receivables
    FRIENDLY_REMINDER,
    FORMAL_NOTICE,
    ESCALATE_TO_HUMAN
}
