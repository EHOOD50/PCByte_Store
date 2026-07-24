package com.asthood.techstore.controller;

import com.asthood.techstore.dto.AdminDashboardDTO;
import com.asthood.techstore.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public AdminDashboardDTO getDashboard() {

        return adminDashboardService.getDashboard();

    }

}