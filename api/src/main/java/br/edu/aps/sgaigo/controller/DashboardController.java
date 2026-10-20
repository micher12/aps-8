package br.edu.aps.sgaigo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.aps.sgaigo.dto.ApiResponse;
import br.edu.aps.sgaigo.service.DashboardService;
import br.edu.aps.sgaigo.service.DashboardService.DashboardResumo;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

	private final DashboardService service;

	public DashboardController(DashboardService service) {
		this.service = service;
	}

	@GetMapping("/resumo")
	public ApiResponse<DashboardResumo> resumo(@RequestParam(required = false) Long organizacaoId) {
		return ApiResponse.ok(service.resumo(organizacaoId));
	}
}
