package com.asthood.techstore.controller;

import com.asthood.techstore.dto.ImageUploadResponse;
import com.asthood.techstore.service.ImageUploadService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(
            ImageUploadService imageUploadService
    ) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ImageUploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl =
                imageUploadService.uploadProductImage(file);

        ImageUploadResponse response =
                new ImageUploadResponse(imageUrl);

        return ResponseEntity.ok(response);
    }
}