package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.PlanningHebdomadaireDto;
import com.example.emploiDuTemps.entity.Filiere;
import com.example.emploiDuTemps.entity.PlanningHebdomadaire;
import com.example.emploiDuTemps.service.FiliereService;
import com.example.emploiDuTemps.service.PlanningHebdomadaireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/planning")
public class PlanningHebdomadaireController {

    private final PlanningHebdomadaireService service;
    private final FiliereService filiereService;

    public PlanningHebdomadaireController(PlanningHebdomadaireService service, FiliereService filiereService) {
        this.service = service;
        this.filiereService = filiereService;
    }

    @GetMapping
    public List<PlanningHebdomadaireDto> getAll() {
        return service.getAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanningHebdomadaireDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toDto(service.getById(id)));
    }

    @PostMapping
    public ResponseEntity<PlanningHebdomadaireDto> create(@RequestBody PlanningHebdomadaireDto dto) {
        PlanningHebdomadaire created = service.create(toEntity(dto));
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanningHebdomadaireDto> update(@PathVariable Integer id,
                                                          @RequestBody PlanningHebdomadaireDto dto) {
        PlanningHebdomadaire updated = service.update(id, toEntity(dto));
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private PlanningHebdomadaireDto toDto(PlanningHebdomadaire planning) {
        PlanningHebdomadaireDto dto = new PlanningHebdomadaireDto();
        dto.setId(planning.getId());
        dto.setFiliereId(planning.getFiliere() != null ? planning.getFiliere().getId() : null);
        dto.setSemaineAnnee(planning.getSemaineAnnee());
        dto.setDateDebut(planning.getDateDebut());
        dto.setDateFin(planning.getDateFin());
        dto.setStatut(planning.getStatut().name());
        dto.setSemestre(planning.getSemestre());
        dto.setDateCreation(planning.getDateCreation());
        return dto;
    }

    private PlanningHebdomadaire toEntity(PlanningHebdomadaireDto dto) {
        PlanningHebdomadaire entity = new PlanningHebdomadaire();
        entity.setId(dto.getId());
        if (dto.getFiliereId() != null) {
            Filiere filiere = filiereService.getById(dto.getFiliereId());
            entity.setFiliere(filiere);
        }
        entity.setSemaineAnnee(dto.getSemaineAnnee());
        entity.setDateDebut(dto.getDateDebut());
        entity.setDateFin(dto.getDateFin());
        
        if (dto.getId() != null && dto.getStatut() != null) {
            entity.setStatut(PlanningHebdomadaire.Statut.valueOf(dto.getStatut()));
        }
        entity.setSemestre(dto.getSemestre());
        entity.setDateCreation(dto.getDateCreation());
        return entity;
    }


    @GetMapping("/actif/{filiereId}")
    public ResponseEntity<PlanningHebdomadaireDto> getPlanningActifByFiliere(@PathVariable Integer filiereId) {
        PlanningHebdomadaire planningActif = service.getPlanningActifByFiliere(filiereId);
        if (planningActif == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDto(planningActif));
    }

}
