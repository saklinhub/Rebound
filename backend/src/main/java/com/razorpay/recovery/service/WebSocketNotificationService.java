package com.razorpay.recovery.service;

import com.razorpay.recovery.model.dto.WebSocketEventDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void emitEvent(WebSocketEventDTO event) {
        messagingTemplate.convertAndSend("/topic/agent-events", event);
    }
}
