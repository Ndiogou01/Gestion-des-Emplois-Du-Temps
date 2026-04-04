package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.EnseignantDto;
import com.example.emploiDuTemps.entity.Enseignant;
import com.example.emploiDuTemps.service.EnseignantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;

    public EnseignantController(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    @GetMapping
    public List<EnseignantDto> getAll() {
        return enseignantService.getAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnseignantDto> getById(@PathVariable Integer id) {
        Enseignant enseignant = enseignantService.getById(id);
        return ResponseEntity.ok(toDto(enseignant));
    }

    @PostMapping
    public ResponseEntity<EnseignantDto> create(@RequestBody EnseignantDto enseignantDto) {
        Enseignant enseignant = toEntity(enseignantDto);
        Enseignant created = enseignantService.create(enseignant);
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnseignantDto> update(@PathVariable Integer id, @RequestBody EnseignantDto enseignantDto) {
        Enseignant enseignant = toEntity(enseignantDto);
        Enseignant updated = enseignantService.update(id, enseignant);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        enseignantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filiere/{filiereId}")
    public List<EnseignantDto> getByFiliere(@PathVariable Integer filiereId) {
        return enseignantService.getByFiliere(filiereId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private EnseignantDto toDto(Enseignant enseignant) {
        EnseignantDto dto = new EnseignantDto();
        dto.setId(enseignant.getId());
        dto.setNomEnseignant(enseignant.getNomEnseignant());
        dto.setPrenomEnseignant(enseignant.getPrenomEnseignant());
        dto.setSpecialite(enseignant.getSpecialite());
        dto.setDepartement(enseignant.getDepartement());
        dto.setEmailEnseignant(enseignant.getEmailEnseignant());
        return dto;
    }

    private Enseignant toEntity(EnseignantDto dto) {
        Enseignant enseignant = new Enseignant();
        enseignant.setId(dto.getId());
        enseignant.setNomEnseignant(dto.getNomEnseignant());
        enseignant.setPrenomEnseignant(dto.getPrenomEnseignant());
        enseignant.setSpecialite(dto.getSpecialite());
        enseignant.setDepartement(dto.getDepartement());
        enseignant.setEmailEnseignant((dto.getEmailEnseignant()));
        return enseignant;
    }
}
