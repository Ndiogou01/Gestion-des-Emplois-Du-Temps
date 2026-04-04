package com.example.emploiDuTemps.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class CreneauxDto {
    private Integer id;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Integer coursId;
    private Integer enseignantId;
    private Integer salleId;
    private Integer planningHebdomadaireId;

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public LocalTime getHeureDebut() {
        return heureDebut;
    }
    public void setHeureDebut(LocalTime heureDebut) {
        this.heureDebut = heureDebut;
    }
    public LocalTime getHeureFin() {
        return heureFin;
    }
    public void setHeureFin(LocalTime heureFin) {
        this.heureFin = heureFin;
    }
    public Integer getCoursId() {
        return coursId;
    }
    public void setCoursId(Integer coursId) {
        this.coursId = coursId;
    }
    public Integer getEnseignantId() {
        return enseignantId;
    }
    public void setEnseignantId(Integer enseignantId) {
        this.enseignantId = enseignantId;
    }
    public Integer getSalleId() {
        return salleId;
    }
    public void setSalleId(Integer salleId) {
        this.salleId = salleId;
    }
    public Integer getPlanningHebdomadaireId() { return planningHebdomadaireId; }
    public void setPlanningHebdomadaireId(Integer planningHebdomadaireId) { this.planningHebdomadaireId = planningHebdomadaireId;}

}
