package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.CreneauxDto;
import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.Creneaux;
import com.example.emploiDuTemps.entity.Enseignant;
import com.example.emploiDuTemps.entity.Salle;
import com.example.emploiDuTemps.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/creneaux")
public class CreneauxController {

    private final CreneauxService creneauxService;
    private final CoursService coursService;
    private final EnseignantService enseignantService;
    private final SalleService salleService;
    private final PlanningHebdomadaireService planningHebdomadaireService;

    public CreneauxController(CreneauxService creneauxService,
                              CoursService coursService,
                              EnseignantService enseignantService,
                              SalleService salleService,
                              PlanningHebdomadaireService planningHebdomadaireService) {
        this.creneauxService = creneauxService;
        this.coursService = coursService;
        this.enseignantService = enseignantService;
        this.salleService = salleService;
        this.planningHebdomadaireService = planningHebdomadaireService;
    }

    @GetMapping
    public List<CreneauxDto> getAll(@RequestParam(required = false) Integer planningHebdomadaireId) {
        List<Creneaux> creneaux;

        if (planningHebdomadaireId != null) {
            creneaux = creneauxService.getByPlanningHebdomadaireId(planningHebdomadaireId);
        } else {
            creneaux = creneauxService.getAll();
        }

        return creneaux.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<CreneauxDto> getById(@PathVariable Integer id) {
        Creneaux edt = creneauxService.getById(id);
        return ResponseEntity.ok(toDto(edt));
    }

    @PostMapping
    public ResponseEntity<CreneauxDto> create(@RequestBody CreneauxDto dto) {
        Creneaux creneau = toEntity(dto);

        if (creneauxService.hasConflit(creneau)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Conflit détecté : l’enseignant ou la salle est déjà occupé(e) à cette heure."
            );
        }

        Creneaux created = creneauxService.create(creneau);
        return ResponseEntity.ok(toDto(created));
    }


    @PutMapping("/{id}")
    public ResponseEntity<CreneauxDto> update(@PathVariable Integer id, @RequestBody CreneauxDto dto) {
        Creneaux creneau = toEntity(dto);
        creneau.setId(id);

        if (creneauxService.hasConflit(creneau)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Conflit détecté : l’enseignant ou la salle est déjà occupé(e) à cette heure."
            );
        }

        Creneaux updated = creneauxService.update(id, creneau);
        return ResponseEntity.ok(toDto(updated));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        creneauxService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private CreneauxDto toDto(Creneaux creneaux) {
        CreneauxDto dto = new CreneauxDto();
        dto.setId(creneaux.getId());
        dto.setDate(creneaux.getDate());
        dto.setHeureDebut(creneaux.getHeureDebut());
        dto.setHeureFin(creneaux.getHeureFin());
        if (creneaux.getCours() != null) {
            dto.setCoursId(creneaux.getCours().getId());
        }
        if (creneaux.getEnseignant() != null) {
            dto.setEnseignantId(creneaux.getEnseignant().getId());
        }
        if (creneaux.getSalle() != null) {
            dto.setSalleId(creneaux.getSalle().getId());
        }
        if (creneaux.getPlanningHebdomadaire() != null) {
            dto.setPlanningHebdomadaireId(creneaux.getPlanningHebdomadaire().getId());
        }
        return dto;
    }

    private Creneaux toEntity(CreneauxDto dto) {
        Creneaux edt = new Creneaux();
        edt.setId(dto.getId());
        edt.setDate(dto.getDate());
        edt.setHeureDebut(dto.getHeureDebut());
        edt.setHeureFin(dto.getHeureFin());

        if (dto.getCoursId() != null) {
            Cours cours = coursService.getById(dto.getCoursId());
            edt.setCours(cours);
        }
        if (dto.getEnseignantId() != null) {
            Enseignant enseignant = enseignantService.getById(dto.getEnseignantId());
            edt.setEnseignant(enseignant);
        }
        if (dto.getSalleId() != null) {
            Salle salle = salleService.getById(dto.getSalleId());
            edt.setSalle(salle);
        }
        if (dto.getPlanningHebdomadaireId() != null) {
            edt.setPlanningHebdomadaire(planningHebdomadaireService.getById(dto.getPlanningHebdomadaireId()));
        }
        return edt;
    }
}
