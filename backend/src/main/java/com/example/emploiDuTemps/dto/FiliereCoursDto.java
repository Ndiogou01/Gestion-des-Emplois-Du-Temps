package com.example.emploiDuTemps.dto;

public class FiliereCoursDto {
    private Integer id;
    private Integer filiereId;
    private Integer coursId;
    private Integer volumeHoraireEffectue;
    private String nomCours;
    private String typeDeCours;
    private Integer volumeHoraireTotal;

    public FiliereCoursDto() {}

    public FiliereCoursDto(Integer id, Integer filiereId, Integer coursId,
                           Long volumeHoraireEffectue, Integer volumeHoraireTotal, String nomCours, String typeDeCours) {
        this.id = id;
        this.filiereId = filiereId;
        this.coursId = coursId;
        this.volumeHoraireEffectue = volumeHoraireEffectue != null ? volumeHoraireEffectue.intValue() : 0;
        this.volumeHoraireTotal = volumeHoraireTotal;
        this.nomCours = nomCours;
        this.typeDeCours = typeDeCours;
    }

    public Integer getVolumeHoraireEffectue() { return volumeHoraireEffectue; }
    public void setVolumeHoraireEffectue(Integer volumeHoraireEffectue) { this.volumeHoraireEffectue = volumeHoraireEffectue; }
    public String getNomCours() { return nomCours; }
    public String getTypeDeCours() { return typeDeCours; }
    public void setTypeDeCours(String typeDeCours) { this.typeDeCours = typeDeCours; }
    public void setNomCours(String nomCours) { this.nomCours = nomCours; }
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getFiliereId() {
        return filiereId;
    }
    public void setFiliereId(Integer filiereId) {
        this.filiereId = filiereId;
    }
    public Integer getCoursId() { return coursId; }
    public void setCoursId(Integer coursId) {
        this.coursId = coursId;
    }
    public Integer getVolumeHoraireTotal() {
        return volumeHoraireTotal;
    }
    public void setVolumeHoraireTotal(Integer volumeHoraireTotal) { this.volumeHoraireTotal = volumeHoraireTotal; }
}
