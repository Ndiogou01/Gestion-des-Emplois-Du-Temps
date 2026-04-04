package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.FiliereCoursDto;
import com.example.emploiDuTemps.dto.SuiviCoursDto;
import com.example.emploiDuTemps.entity.*;
import com.example.emploiDuTemps.entity.SuiviCours;
import com.example.emploiDuTemps.service.SuiviCoursService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suivi-cours")
@CrossOrigin(origins = "*")
public class SuiviCoursController {

    private final SuiviCoursService service;

    public SuiviCoursController(SuiviCoursService service) {
        this.service = service;
    }

    @GetMapping
    public List<SuiviCoursDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public SuiviCoursDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public SuiviCoursDto create(@RequestBody SuiviCours suiviCours) {
        return service.save(suiviCours);
    }

    @PutMapping("/{id}")
    public SuiviCoursDto update(@PathVariable Integer id, @RequestBody SuiviCours suiviCours) {
        suiviCours.setId(id);
        return service.save(suiviCours);
    }

    @GetMapping("/progression/{filiereId}")
    public List<FiliereCoursDto> getProgression(@PathVariable Long filiereId) {
        return service.getProgressionByFiliere(filiereId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
