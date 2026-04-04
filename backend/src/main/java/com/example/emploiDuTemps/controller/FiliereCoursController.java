package com.example.emploiDuTemps.controller;

import com.example.emploiDuTemps.dto.FiliereCoursDto;
import com.example.emploiDuTemps.entity.Cours;
import com.example.emploiDuTemps.entity.Filiere;
import com.example.emploiDuTemps.entity.FiliereCours;
import com.example.emploiDuTemps.service.CoursService;
import com.example.emploiDuTemps.service.FiliereCoursService;
import com.example.emploiDuTemps.service.FiliereService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/filiere-cours")
public class FiliereCoursController {

    private final FiliereCoursService filiereCoursService;
    private final FiliereService filiereService;
    private final CoursService coursService;

    public FiliereCoursController(
            FiliereCoursService filiereCoursService,
            FiliereService filiereService,
            CoursService coursService
    ) {
        this.filiereCoursService = filiereCoursService;
        this.filiereService = filiereService;
        this.coursService = coursService;
    }

    @GetMapping
    public List<FiliereCoursDto> getAll() {
        return filiereCoursService.getAll().stream().map(fc -> {
            FiliereCoursDto dto = new FiliereCoursDto();
            dto.setId(fc.getId());
            dto.setFiliereId(fc.getFiliere().getId());
            dto.setCoursId(fc.getCours().getId());
            dto.setVolumeHoraireTotal(fc.getVolumeHoraireTotal());
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public FiliereCoursDto getById(@PathVariable Integer id) {
        FiliereCours fc = filiereCoursService.getById(id);
        FiliereCoursDto dto = new FiliereCoursDto();
        dto.setId(fc.getId());
        dto.setFiliereId(fc.getFiliere().getId());
        dto.setCoursId(fc.getCours().getId());
        return dto;
    }

    @PostMapping
    public FiliereCoursDto create(@RequestBody FiliereCoursDto dto) {
        Filiere filiere = filiereService.getById(dto.getFiliereId());
        Cours cours = coursService.getById(dto.getCoursId());

        FiliereCours fc = new FiliereCours();
        fc.setFiliere(filiere);
        fc.setCours(cours);

        FiliereCours saved = filiereCoursService.create(fc);
        dto.setId(saved.getId());
        return dto;
    }

    @PutMapping("/{id}")
    public FiliereCoursDto update(@PathVariable Integer id, @RequestBody FiliereCoursDto dto) {
        Filiere filiere = filiereService.getById(dto.getFiliereId());
        Cours cours = coursService.getById(dto.getCoursId());

        FiliereCours fc = new FiliereCours();
        fc.setId(id);
        fc.setFiliere(filiere);
        fc.setCours(cours);
        fc.setVolumeHoraireTotal(dto.getVolumeHoraireTotal());
        FiliereCours updated = filiereCoursService.update(id, fc);
        dto.setId(updated.getId());
        return dto;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        filiereCoursService.delete(id);
    }

}
