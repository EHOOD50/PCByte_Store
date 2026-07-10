package com.asthood.techstore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RedirectController {

    // ✅ Este ÚNICO método maneja la ruta /success
    @GetMapping("/success")
    public String redirectToFrontend(@RequestParam(name = "external_reference", required = false) String orderId) {
        // Si orderId es nulo, usamos "unknown" para evitar errores en React
        String target = (orderId != null) ? orderId : "unknown";
        return "redirect:http://192.168.100.226:5173/success?orderId=" + target;
    }
}