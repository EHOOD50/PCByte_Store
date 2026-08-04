package com.asthood.techstore.controller;

import com.asthood.techstore.dto.system.SystemStatusDTO;
import com.asthood.techstore.service.system.SystemStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
public class AdminSystemController {

    private final SystemStatusService systemStatusService;

    @GetMapping("/status")
    public ResponseEntity<SystemStatusDTO> getSystemStatus() {
        return ResponseEntity.ok(
                systemStatusService.getSystemStatus()
        );
    }
}