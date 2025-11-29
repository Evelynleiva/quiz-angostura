from django.db import models

class Ranking(models.Model):
    id = models.AutoField(primary_key=True)
    sesion = models.OneToOneField('usuarios.SesionQuiz', on_delete=models.CASCADE, related_name='ranking_entry')
    posicion = models.IntegerField()
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ranking'
        ordering = ['posicion']
    
    def __str__(self):
        return f"#{self.posicion}"