package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.SalleDto;
import com.example.emploiDuTemps.entity.Salle;
import com.example.emploiDuTemps.service.SalleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/salles")
public class SalleController {

    private final SalleService salleService;

    public SalleController(SalleService salleService) {
        this.salleService = salleService;
    }

    @GetMapping
    public List<SalleDto> getAll() {
        return salleService.getAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalleDto> getById(@PathVariable Integer id) {
        Salle salle = salleService.getById(id);
        return ResponseEntity.ok(toDto(salle));
    }

    @PostMapping
    public ResponseEntity<SalleDto> create(@RequestBody SalleDto salleDto) {
        Salle salle = toEntity(salleDto);
        Salle created = salleService.create(salle);
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalleDto> update(@PathVariable Integer id, @RequestBody SalleDto salleDto) {
        Salle salle = toEntity(salleDto);
        Salle updated = salleService.update(id, salle);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        salleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private SalleDto toDto(Salle salle) {
        SalleDto dto = new SalleDto();
        dto.setId(salle.getId());
        dto.setNomSalle(salle.getNomSalle());
        return dto;
    }

    private Salle toEntity(SalleDto dto) {
        Salle salle = new Salle();
        salle.setId(dto.getId());
        salle.setNomSalle(dto.getNomSalle());
        return salle;
    }
}
