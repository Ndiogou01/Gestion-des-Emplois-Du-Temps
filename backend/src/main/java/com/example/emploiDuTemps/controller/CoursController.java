package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.CoursDto;
import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.Enseignant;
import com.example.emploiDuTemps.entity.FiliereCours;
import com.example.emploiDuTemps.entity.Type;
import com.example.emploiDuTemps.repository.FiliereCoursRepository;
import com.example.emploiDuTemps.exception.ResourceNotFoundException;
import com.example.emploiDuTemps.service.CoursService;
import com.example.emploiDuTemps.service.EnseignantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cours")
public class CoursController {

    private final CoursService coursService;
    private final EnseignantService enseignantService;

    public CoursController(CoursService coursService, EnseignantService enseignantService) {
        this.coursService = coursService;
        this.enseignantService = enseignantService;
    }

    @GetMapping
    public List<CoursDto> getAll() {
        return coursService.getAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CoursDto> getById(@PathVariable Integer id) {
        Cours cours = coursService.getById(id);
        return ResponseEntity.ok(toDto(cours));
    }

    @PostMapping
    public ResponseEntity<CoursDto> create(@RequestBody CoursDto dto) {
        Cours cours = toEntity(dto);
        Cours created = coursService.create(cours);
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoursDto> update(@PathVariable Integer id, @RequestBody CoursDto dto) {
        Cours cours = toEntity(dto);
        Cours updated = coursService.update(id, cours);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        coursService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filiere/{filiereId}")
    public List<CoursDto> getCoursByFiliere(@PathVariable Integer filiereId) {
        return coursService.getByFiliere(filiereId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/distinct")
    public List<CoursDto> getAllDistinct() {
        return coursService.getAllDistinct()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private CoursDto toDto(Cours cours) {
        CoursDto dto = new CoursDto();
        dto.setId(cours.getId());
        dto.setNomCours(cours.getNomCours());
        dto.setTypeDeCours(cours.getTypeDeCours() != null ? cours.getTypeDeCours() : null);

        if (cours.getEnseignantResponsable() != null) {
            dto.setEnseignantResponsableId(cours.getEnseignantResponsable().getId());
        }
        return dto;
    }

    private Cours toEntity(CoursDto dto) {
        Cours cours = new Cours();
        cours.setId(dto.getId());
        cours.setNomCours(dto.getNomCours());
        cours.setTypeDeCours(dto.getTypeDeCours());
        if (dto.getEnseignantResponsableId() != null) {
            try {
                Enseignant enseignant = enseignantService.getById(dto.getEnseignantResponsableId());
                cours.setEnseignantResponsable(enseignant);
            } catch (ResourceNotFoundException ex) {
                throw new IllegalArgumentException("Enseignant avec l’ID " + dto.getEnseignantResponsableId() + " introuvable.");
            }
        }
        return cours;
    }
}
