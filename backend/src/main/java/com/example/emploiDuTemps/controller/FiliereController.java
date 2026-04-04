package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.FiliereDto;
import com.example.emploiDuTemps.entity.Filiere;
import com.example.emploiDuTemps.service.FiliereService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/filieres")
public class FiliereController {

    private final FiliereService filiereService;

    public FiliereController(FiliereService filiereService) {
        this.filiereService = filiereService;
    }

    @GetMapping
    public List<FiliereDto> getAll() {
        return filiereService.getAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FiliereDto> getById(@PathVariable Integer id) {
        Filiere filiere = filiereService.getById(id);
        return ResponseEntity.ok(toDto(filiere));
    }

    @PostMapping
    public ResponseEntity<FiliereDto> create(@RequestBody FiliereDto filiereDto) {
        Filiere filiere = toEntity(filiereDto);
        Filiere created = filiereService.create(filiere);
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FiliereDto> update(@PathVariable Integer id, @RequestBody FiliereDto filiereDto) {
        Filiere filiere = toEntity(filiereDto);
        Filiere updated = filiereService.update(id, filiere);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        filiereService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private FiliereDto toDto(Filiere filiere) {
        FiliereDto dto = new FiliereDto();
        dto.setId(filiere.getId());
        dto.setNomFiliere(filiere.getNomFiliere());
        return dto;
    }

    private Filiere toEntity(FiliereDto dto) {
        Filiere filiere = new Filiere();
        filiere.setId(dto.getId());
        filiere.setNomFiliere(dto.getNomFiliere());
        return filiere;
    }
}
